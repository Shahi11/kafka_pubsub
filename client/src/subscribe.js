import React, { useEffect, useState } from "react";
import "./subscribe.css";
import Swal from "sweetalert2";

const INIT_SUBSCRIPTIONS = {
  service1: false,
  service2: false,
  service3: false,
};

const Home = () => {
  const [subscriptionStatuses, setSubscriptionStatuses] =
    useState(INIT_SUBSCRIPTIONS);

  useEffect(() => {
    const email = sessionStorage.getItem("USER_EMAIL");
    const res = fetch("http://localhost:5000/lsds/subscribe/list/" + email, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ newDocument }) => {
        console.log(newDocument);

        sessionStorage.setItem("service1", newDocument.service1 || false);
        sessionStorage.setItem("service2", newDocument.service2 || false);
        sessionStorage.setItem("service3", newDocument.service3 || false);
        sessionStorage.setItem("deadvertise", newDocument.deadvertise || false);

        setSubscriptionStatuses({
          service1: newDocument.service1 || false,
          service2: newDocument.service2 || false,
          service3: newDocument.service3 || false,
        });
      });
    // setSubscriptionStatuses here
  }, []);

  const goToLogin = () => {
    window.location.href = "/login-page";
  };
  const goToRegister = () => {
    window.location.href = "/signup";
  };

  const handleSubmit = (serviceName) => {
    console.log("Here");
    let finalStatuses = {
      ...subscriptionStatuses,
    };
    finalStatuses[serviceName] = !finalStatuses[serviceName];
    setSubscriptionStatuses(finalStatuses);
    console.log(finalStatuses);

    const res = fetch("http://localhost:5000/lsds/subscribe/add", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: sessionStorage.getItem("USER_EMAIL"),
        [serviceName]: finalStatuses[serviceName],
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        sessionStorage.setItem(serviceName, finalStatuses[serviceName]);
        if (finalStatuses[serviceName]) {
          Swal.fire({
            title: "Successfully Subscribed",
            icon: "success",
            buttons: ["NO", "YES"],
          }).then(function (isConfirm) {
            if (isConfirm) {
            } else {
              //if no clicked => do something else
            }
          });
        } else {
          Swal.fire({
            title: "Successfully Unsubscribed! Sad to see you go",
            icon: "success",
            buttons: ["NO", "YES"],
          }).then(function (isConfirm) {
            if (isConfirm) {
            } else {
              //if no clicked => do something else
            }
          });
        }
      })
      .catch((err) => console.log("My error, ", err));
  };

  const goHome = () => {
    window.location.href = "/login";
  };

  return (
    <div>
      <divs>
        <h1>Services</h1>
        <p>{sessionStorage.getItem("USER_EMAIL")}</p>
      </divs>

      <div class="user js-user-1">
        <div class="head">
          <h2>Covid Hotspot</h2>
        </div>
        <button
          id="demo"
          onClick={() => handleSubmit("service1")}
          style={{
            backgroundColor: !subscriptionStatuses.service1
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service1
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </button>
      </div>

      <div class="user js-user-2">
        <div class="head">
          <h2>Top 10 testing countries</h2>
        </div>
        <button
          id="demo"
          onClick={() => handleSubmit("service2")}
          style={{
            backgroundColor: !subscriptionStatuses.service2
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service2
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </button>
      </div>

      <div class="user js-user-3">
        <div class="head">
          <h2>Safe Countries to travel</h2>
        </div>
        <button
          id="demo"
          onClick={() => handleSubmit("service3")}
          style={{
            backgroundColor: !subscriptionStatuses.service3
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service3
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </button>
      </div>
      <div class="box-1">
        <div class="btnn btn-one" onClick={goHome}>
          <span>BACK</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
