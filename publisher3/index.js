const CovidTallyPubSub = require("./models/CovidTallyPubSub");

const CasesSortedReverse = require("./models/CasesSortedReverse");
let cache2 = [];

const { Kafka } = require("kafkajs");

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");

const url = `mongodb://mongo:27017`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = express();

app.use(cors({}));

const http = require("http").Server(app);

MongoClient.connect(url, options, (err, database) => {
  if (err) {
    console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`);
    process.exit(1);
  }
  app.locals.db = database.db("api");
  const listener = http.listen(4002, "0.0.0.0", () => {
    console.log(listener.address && listener.address());
    console.log("App started on port 4002");

    setInterval(checkUpdates, 20000);
    // Scheduler : runs every 10 seconds
  });
});

const task = async (sortKey, sortIndex = -1, tableName, callback) => {
  let arrayOfPromises1 = [];
  console.log("inside task");
  await app.locals.db.collection(tableName).deleteMany({});
  let sortedTotalCases = {
    [`newDocument.${sortKey}`]: sortIndex,
  };
  await app.locals.db
    .collection("CovidTallyPubSub")
    .find({})
    .sort(sortedTotalCases)
    .toArray(async (err, res) => {
      if (err) throw err;
      let status2 = false;

      var serviceArray = [];
      console.log(typeof tableName);
      if (tableName == "CasesSortedReverse" && cache2.length != 0) {
        for (var k = 0; k < 10; k++) {
          if (cache2[k] != res[k].newDocument.country) {
            console.log(
              "Abhinav 1",
              cache2[k],
              JSON.stringify(res[k].newDocument.country)
            );
            status2 = true;
            break;
          }
        }
      } else {
        status2 = true;
      }
      // console.log(status,cache)
      // console.log(status1,cache1)
      // console.log(status2,cache2)

      console.log("----------------");
      for (var j = 0; j < 10; ++j) {
        let i = j;
        arrayOfPromises1.push(
          new Promise(async (resolve, reject) => {
            if (res) {
              let newServiceOne;
              if (tableName == "CasesSortedReverse" && status2) {
                cache2[i] = res[i].newDocument.country;
                newServiceOne = new CasesSortedReverse(
                  res[i].newDocument.country,
                  res[i].newDocument.casestotal
                );
                serviceArray.push(newServiceOne);
                console.log(serviceArray);
              }

              await app.locals.db.collection(tableName).insertOne(
                {
                  newServiceOne,
                },
                (err, result) => {
                  if (err) {
                    console.log("Error ");
                  } else {
                    resolve({
                      message: sortKey + " table updated with new data",
                    });
                  }
                }
              );
            }
          })
        );
      }

      if (
        Object.keys(serviceArray).length > 0 &&
        Object.keys(serviceArray).length % 10 == 0
      ) {
        console.log("inside sending fiorward", serviceArray);
        // socket.emit("pubToBroker", serviceArray);

        const kafka = new Kafka({
          clientId: "Broker-3",
          brokers: ["kafka-3:9094"],
        });
        const producer = kafka.producer();
        console.log("Connecting.....");
        var admin = kafka.admin();
        await admin.connect();
        await admin.createTopics({
          topics: [
            {
              topic: "safeCountriesToVisit",
              numPartitions: 2,
            },
          ],
        });
        await admin.disconnect();
        await producer.connect();
        console.log("Connected!");
        //has to be done by the db
        const result = await producer.send({
          topic: "safeCountriesToVisit",
          messages: [
            {
              value: serviceArray,
              partition: 2,
            },
          ],
        });
        console.log(
          `Message successfully Published!!! ${JSON.stringify(result)}`
        );
      }
      cache2 = [];
    });

  await Promise.all(arrayOfPromises1).then((res) => {
    // Task 1 Complete
    console.log(
      "============ TASK COMPLETE OF ========================",
      sortKey
    );
    // Table CasesSorted Filled Now
    callback();
  });
};

async function checkUpdates() {
  // Fetch live data
  const apiResponse = await fetch(
    "https://covid-193.p.rapidapi.com/statistics",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
        "x-rapidapi-key": "8db2057954mshc87391dbe9a8741p1f00bcjsne2293f69c094",
      },
    }
  ).then((apiResponse) => apiResponse.json());

  // Fetch statistics from our db
  const apilen = apiResponse.response.length;
  let arrayOfPromises = [];

  //// Putting API Data to DB
  for (let i = 0; i < apilen; i++) {
    arrayOfPromises.push(
      new Promise(async (resolve, reject) => {
        await app.locals.db.collection("CovidTallyPubSub").findOne(
          {
            "newDocument.country": apiResponse.response[i].country,
          },
          async (err, result) => {
            if (err) {
              reject("Error");
            }
            // if (!result) {
            await app.locals.db.collection("CovidTallyPubSub").deleteMany({});
            //if ( JSON.stringify( apiResponse.response[i].country) !=  JSON.stringify( apiResponse.response[i].continent)){
            const newDocument = new CovidTallyPubSub(
              apiResponse.response[i].country,
              apiResponse.response[i].cases.active,
              apiResponse.response[i].cases.total,
              apiResponse.response[i].deaths.total,
              apiResponse.response[i].tests.total,
              apiResponse.response[i].day,
              apiResponse.response[i].time
            );
            await app.locals.db.collection("CovidTallyPubSub").insertOne(
              {
                newDocument,
              },
              (err, result) => {
                if (err) {
                  reject("Error");
                } else {
                  resolve({
                    message: "Table updated",
                    newData: i,
                  });
                }
              }
            );
            //}
          }
        );
      })
    );
  }

  console.log(await app.locals.db.collection("CasesSortedReverse").count());
  if (app.locals.db.collection("CasesSortedReverse").count() != 10) {
    Promise.all(arrayOfPromises)
      .then(async (res) => {
        // console.log("Final Result", res);
        await task("casestotal", 1, "CasesSortedReverse", () => {});
      })
      .catch((err) => {
        console.log("Final errors", err);
      });
  }
}

module.exports = app;
