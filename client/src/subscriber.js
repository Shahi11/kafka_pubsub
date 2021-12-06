import { result } from "lodash";
import socketIOClient from "socket.io-client";

var decoder = new TextDecoder("utf-8");

function ab2str(buf) {
  return decoder.decode(new Uint8Array(buf));
}

export function subscribeToTopic(topicId) {
  // var ws = new WebSocket("ws://localhost:15674/ws");
  // let stompClient = Stomp.over(ws);
  // stompClient.connect({}, function () {
  //   stompClient.subscribe("queue." + topicId, function ({ body }) {
  //     body = JSON.parse(body);
  //     if (body[0].safeCountriesToVisit) {
  //       sessionStorage.setItem("safeCountriesToVisit", JSON.stringify(body));
  //     } else if (body[0].casestotal) {
  //       sessionStorage.setItem("casestotal", JSON.stringify(body));
  //     } else if (body[0].totalTests) {
  //       sessionStorage.setItem("totalTests", JSON.stringify(body));
  //     }
  //     if (topicId == "ad") {
  //       sessionStorage.setItem("ad", JSON.stringify(body));
  //     }
  //     const customEvent = new CustomEvent("fetch-ls", {
  //       detail: {
  //         message: "Fetch local storage now",
  //       },
  //     });
  //     window.dispatchEvent(customEvent);
  //   });
  // });
  const socket = socketIOClient("http://localhost:5004");
  // Request particular topic
  socket.emit("subscribe-topic", {
    topicId: topicId,
  });
  socket.on("kafka-message-" + topicId, ({ message }) => {
    let result = ab2str(message);
    console.log("KAFKA RESPONSE for Topic ID " + topicId, result);

    if (topicId == "casestotal") {
      sessionStorage.setItem("casestotal", result);
    } else if (topicId == "totalTests") {
      sessionStorage.setItem("totalTests", result);
    } else if (topicId == "safeCountriesToVisit") {
      sessionStorage.setItem("safeCountriesToVisit", result);
    }
  });
}
