const CovidTallyPubSub = require("./models/CovidTallyPubSub");
const tests = require("./models/tests");
let cache1 = [];

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
  const listener = http.listen(4001, "0.0.0.0", () => {
    console.log(listener.address && listener.address());
    console.log("App started on port 4001");

    setInterval(checkUpdates, 20000);
    // Scheduler : runs every 20 seconds
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
      let status1 = false;

      var serviceArray = [];
      console.log(typeof tableName);
      if (tableName == "tests" && cache1.length != 0) {
        for (var k = 0; k < 10; k++) {
          if (cache1[k] != res[k].newDocument.country) {
            console.log(
              "Abhinav 1",
              cache1[k],
              JSON.stringify(res[k].newDocument.country)
            );
            status1 = true;
            break;
          }
        }
      } else {
        status1 = true;
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
              if (status1) {
                cache1[i] = res[i].newDocument.country;
                newServiceOne = new tests(
                  res[i].newDocument.country,
                  res[i].newDocument.teststotalTests
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
        // Create topic

        const kafka = new Kafka({
          clientId: "Broker-2",
          brokers: ["kafka-2:9093"],
        });
        var admin = kafka.admin();
        await admin.connect();
        await admin.createTopics({
          topics: [
            {
              topic: "totalTests",
              numPartitions: 2,
            },
          ],
        });
        await admin.disconnect();

        const producer = kafka.producer();
        console.log("Connecting.....");
        await producer.connect();
        console.log("Connected!");
        const result = await producer.send({
          topic: "totalTests",
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
      cache1 = [];
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

  console.log(await app.locals.db.collection("tests").count());
  if (app.locals.db.collection("tests").count() != 10) {
    Promise.all(arrayOfPromises)
      .then(async (res) => {
        // console.log("Final Result", res);
        await task("teststotalTests", -1, "tests", () => {});
      })
      .catch((err) => {
        console.log("Final errors", err);
      });
  }
}

module.exports = app;
