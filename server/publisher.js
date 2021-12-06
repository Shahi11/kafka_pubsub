const amqplib = require("amqplib");

const getGlobalConnection = () => {
  return {
    connection: global.amqplConnection,
    channel: global.channel,
  };
};

const publishMessage = async (topicId, message) => {
  let { connection, channel } = getGlobalConnection();
  if (!connection || !channel) {
    // connection = await amqplib.connect("amqp://localhost:5672", "heartbeat=60"); // ON LOCAL
    connection = await amqplib.connect(
      "amqp://rabbitmq:5672", // ON DOCKER
      "heartbeat=60"
    );
    channel = await connection.createChannel();
    global.amqplConnection = connection;
  }

  try {
    console.log("Publishing");
    const exchange = "CovidQueue";
    const queue = "queue." + topicId;
    const routingKey = topicId;

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    await channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message))
    );

    console.log("Message published");
  } catch (err) {
    console.error("Error in publishing message", e);
  } finally {
    console.info("Closing channel and connection if available");
    await channel.close();
    await connection.close();
    console.info("Channel and connection closed");
  }
};

module.exports = {
  publishMessage,
};
