const Publisher = require("./publisher");

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const { Kafka } = require("kafkajs");

const io = require("socket.io")(5004, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const url = `mongodb://mongo:27017/api`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const routes = require("./routes/routes.js");
const app = express();
app.use(cors({}));
const http = require("http").Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/lsds", routes);
app.use((req, res) => {
  res.status(404);
});

const getKafka1Data = async (callback) => {
  var kafka = new Kafka({
    clientId: "Broker-1",
    brokers: ["kafka-1:9092"],
  });

  var consumer = kafka.consumer({ groupId: "test-3" + Date.now() });
  await consumer.connect();

  // Topic 1
  await consumer.subscribe({
    topic: "casestotal",
    fromBeginning: true,
  });

  return await consumer.run({
    eachMessage: async (result) => {
      console.log(
        `RCVD Msg ${result.message.value} on partition ${result.partition}`
      );
      callback(result.message.value);
    },
  });
};

const getKafka2Data = async (callback) => {
  var kafka = new Kafka({
    clientId: "Broker-2",
    brokers: ["kafka-2:9093"],
  });

  var consumer = kafka.consumer({ groupId: "test-3" + Date.now() });
  await consumer.connect();

  // Topic 2
  await consumer.subscribe({
    topic: "totalTests",
    fromBeginning: true,
  });

  return await consumer.run({
    eachMessage: async (result) => {
      console.log(
        `RCVD Msg ${result.message.value} on partition ${result.partition}`
      );
      callback(result.message.value);
    },
  });
};
const getKafka3Data = async (callback) => {
  var kafka = new Kafka({
    clientId: "Broker-3",
    brokers: ["kafka-3:9094"],
  });

  var consumer = kafka.consumer({ groupId: "test-3" + Date.now() });
  await consumer.connect();

  // Topic 3
  await consumer.subscribe({
    topic: "safeCountriesToVisit",
    fromBeginning: true,
  });

  return await consumer.run({
    eachMessage: async (result) => {
      console.log(
        `RCVD Msg ${result.message.value} on partition ${result.partition}`
      );
      callback(result.message.value);
    },
  });
};

MongoClient.connect(url, options, (err, database) => {
  if (err) {
    console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`);
    process.exit(1);
  }
  app.locals.db = database.db("api");
  const listener = http.listen(5000, "0.0.0.0", () => {
    console.log(listener.address && listener.address());
    console.log("Listening on port 5000");
    app.emit("APP_STARTED");

    io.on("connection", function (socket) {
      console.log("CONNECTION EST. TO PUB", socket.client.id);

      socket.on("subscribe-topic", ({ topicId }) => {
        console.log("SUBSCRIBE REQUEST FOR TOPIC " + topicId);
        switch (topicId) {
          case "casestotal":
            getKafka1Data((message) => {
              console.log("RECEIVED MESSAGE " + message);
              socket.emit("kafka-message-" + topicId, {
                message: message,
              });
            });
            break;
          case "totalTests":
            getKafka2Data((message) => {
              console.log("RECEIVED MESSAGE " + message);
              socket.emit("kafka-message-" + topicId, {
                message: message,
              });
            });
            break;
          case "safeCountriesToVisit":
            getKafka3Data((message) => {
              console.log("RECEIVED MESSAGE " + message);
              socket.emit("kafka-message-" + topicId, {
                message: message,
              });
            });
            break;
        }
        // console.log(data);
        // counter++;
        // if (data && data[0].safeCountriesToVisit) {
        //   console.log("Inside pub");
        //   Publisher.publishMessage("safeCountriesToVisit", data);
        // } else if (data && data[0].totalTests) {
        //   console.log("Inside pub");
        //   Publisher.publishMessage("totalTests", data);
        // } else if (data && data[0].casestotal) {
        //   console.log("Inside pub");
        //   Publisher.publishMessage("casestotal", data);
        // }
        // console.log(counter % 5 == 0);

        // if (counter % 5 == 0) {
        //   Publisher.publishMessage("ad", data);
        // }
      });
    });
  });
});

module.exports = app;
