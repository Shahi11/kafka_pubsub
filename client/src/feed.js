import React, { useEffect, useState } from "react";
import "./feed.css";
import { subscribeToTopic } from "./subscriber";
import Swal from "sweetalert2";

const setStorages = () => {
  if (sessionStorage.getItem("service1") == "true") {
    subscribeToTopic("casestotal");
  }

  if (sessionStorage.getItem("service2") == "true") {
    subscribeToTopic("totalTests");
  }

  if (sessionStorage.getItem("service3") == "true") {
    subscribeToTopic("safeCountriesToVisit");
  }
  if (sessionStorage.getItem("deadvertise") == "false") {
    subscribeToTopic("ad");
  }
};

const Home = () => {
  const [service1Data, setService1Data] = useState(null);
  const [service2Data, setService2Data] = useState(null);
  const [service3Data, setService3Data] = useState(null);
  const [heading, setHeading] = useState(null);
  const [adData, setadData] = useState(null);
  const [deadvertise, setDeadvertise] = useState(null);

  const setDatas = () => {
    setService1Data(JSON.parse(sessionStorage.getItem("casestotal")));
    setService2Data(JSON.parse(sessionStorage.getItem("totalTests")));
    setService3Data(JSON.parse(sessionStorage.getItem("safeCountriesToVisit")));
    setadData(JSON.parse(sessionStorage.getItem("ad")));
    setDeadvertise(sessionStorage.getItem("deadvertise"));
    if (sessionStorage.getItem("service1") == "true") {
      subscribeToTopic("casestotal");
    }

    if (sessionStorage.getItem("service2") == "true") {
      subscribeToTopic("totalTests");
    }

    if (sessionStorage.getItem("service3") == "true") {
      subscribeToTopic("safeCountriesToVisit");
    }
    if (sessionStorage.getItem("deadvertise") == "false") {
      subscribeToTopic("ad");
    }
  };

  const handledeadvertise = () => {
    const res = fetch("http://localhost:5000/lsds/deadvertise", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: sessionStorage.getItem("USER_EMAIL"),
        deadvertise: true,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setDeadvertise(true);
        sessionStorage.setItem("deadvertise", true);
        if (true) {
          Swal.fire({
            title: "You won't receive advertisements anymore!",
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

  useEffect(() => {
    setStorages();
    setDatas();
    window.addEventListener("fetch-ls", setDatas);
    if (sessionStorage.getItem("service1") == "false") {
      setHeading(<h4>Top covid hit countries:</h4>);
    } else if (sessionStorage.getItem("service2") == "false") {
      setHeading(<h4>Top covid testing countries:</h4>);
    } else {
      setHeading(<h4>Safe to travel countries:</h4>);
    }
    return () => {
      window.removeEventListener("fetch-ls", setDatas);
    };
  }, []);

  const countryTab = ({ country }) => (
    <>
      <div className="countryTab">{country}</div>
    </>
  );

  return (
    <div>
      <header>
        <h2>Welcome! {sessionStorage.getItem("USER_EMAIL")}</h2>
        <h4>Here are your subscribed data!</h4>
      </header>
      <br />
      {sessionStorage.getItem("service1") == "false" &&
        sessionStorage.getItem("service2") == "false" &&
        sessionStorage.getItem("service3") == "false" && (
          <>
            <div>
              <h3>
                You are not subscribed to any topic! Please go to homepage and
                subscribe to some topics.
              </h3>
            </div>
          </>
        )}

      <br />
      {sessionStorage.getItem("service1") == "true" && service1Data && (
        <>
          <h2>COVID HOTSPOTS</h2>
          <div className="serviceContainer">
            {service1Data?.data?.map((x) => {
              return !!x && !!x.country && countryTab(x);
            })}
          </div>
        </>
      )}
      <br />
      {sessionStorage.getItem("service2") == "true" && service2Data && (
        <>
          <h2>TOP TESTING SITES</h2>
          <div className="serviceContainer">
            {service2Data?.data?.map((x) => {
              return !!x && !!x.country && countryTab(x);
            })}
          </div>
        </>
      )}
      <br />
      {sessionStorage.getItem("service3") == "true" && service3Data && (
        <>
          <h2>SAFE COUNTRIES TO TRAVEL</h2>
          <div className="serviceContainer">
            {service3Data?.data?.map((x) => {
              return !!x && !!x.country && countryTab(x);
            })}
          </div>
        </>
      )}
      <br />
      {/* {(sessionStorage.getItem("service1") == "false" ||
        sessionStorage.getItem("service2") == "false" ||
        sessionStorage.getItem("service3") == "false") &&
        deadvertise == "false" &&
        adData && (
          <>
            <div>
              <h5 class="ad">
                Advertisement:
                <button class="buttonn" onClick={handledeadvertise}>
                  <span>Not interested </span>
                </button>
              </h5>
              <h6>
                You can subsribe to this topic to stay updated with the latest
                covid related information like below:
              </h6>
              <h2>{!!heading && heading}</h2>

              <div className="serviceContainerad">
                {adData?.data?.map((x) => {
                  return countryTab(x);
                })}
              </div>
            </div>
          </>
        )} */}

      <br />
    </div>
  );
};

export default Home;
