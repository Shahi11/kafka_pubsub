import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import _, { now } from "lodash";
import "./login.css";

export default function Login() {
  const [name, setName] = useState("");
  const [data, setData] = useState("");
  const [myForm, setForm] = useState(null);
  const [password, setPassword] = useState("");
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAPI = async (param) => {
    // GET call to get requested county data
    console.log(param);
    const res = await fetch("http://localhost:5000/lsds/covidTally/" + param, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((dat) => setData(dat))
      .catch((err) => console.log("My error, ", err));
  };

  const fetchallAPI = async () => {
    // GET call to get all the countries COVID Data
    const res = await fetch("http://localhost:5000/lsds/covidTally/", {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((dat) => setData(dat))
      .catch((err) => console.log("My error, ", err));
  };

  const submitForm = () => {
    // GET call to get requested county data
    console.log(formRef.current.code.value);
    var d = new Date();
    d.toLocaleString();
    const res = fetch("http://localhost:5000/lsds/covidTally/", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: formRef.current.code.value,
        country: formRef.current.cName.value,
        confirmed: formRef.current.confirmed.value,
        critical: formRef.current.critical.value,
        deaths: formRef.current.deaths.value,
        recovered: formRef.current.recovered.value,
        lastupdate: d,
      }),
    })
      .then((res) => res.json())
      .then((dat) => {
        setData(dat);
        setShowModal(false);
      })
      .catch((err) => console.log("My error, ", err));
  };

  useEffect(() => {
    console.log("Data");
    console.log(data);
  }, [data]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  const goToSubscription = () => {
    window.location.href = "/subscribe";
  };

  const goTofeed = () => {
    window.location.href = "/feed";
  };

  const formObject = {};
  return (
    <div className="Login">
      <div class="header">
        <img
          src="https://www.fda.gov/files/covid19-1600x900.jpg"
          float="left"
          width="100"
          height="60"
        ></img>
        <a href="#default" class="logo">
          COVID-19 TRACKER
        </a>
        <div class="header-right">
          <button class="button" onClick={goToSubscription}>
            <span>Subscriptions</span>
          </button>
          <a class="active" href="#home" onClick={goToHome}>
            logout
          </a>
        </div>

        <button id="myBtn" onClick={() => setShowModal(true)}>
          ADD / UPDATE DATA
        </button>

        <div
          id="myModal"
          class="modal"
          ref={modalRef}
          style={{ display: `${showModal ? "block" : "none"}` }}
        >
          <div class="modal-content">
            <span class="close" onClick={() => setShowModal(false)}>
              &times;
            </span>

            <form name="myForm" id="myForm" ref={formRef}>
              <h1>COVID SHEET</h1>
              <div class="field">
                <label for="name">Country Name:</label>
                <input
                  type="text"
                  id="cName"
                  name="cName"
                  placeholder="Enter Country Name"
                />
                <small></small>
              </div>
              <div class="field">
                <label for="code">Country Code:</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  placeholder="Enter Country Code"
                />
                <small></small>
              </div>
              <div class="field">
                <label for="confirmed">Confirmed Cases:</label>
                <input
                  type="text"
                  id="confirmed"
                  name="confirmed"
                  placeholder="Enter Confirmed cases"
                />
                <small></small>
              </div>
              <div class="field">
                <label for="critical">Critical Cases:</label>
                <input
                  type="text"
                  id="critical"
                  name="critical"
                  placeholder="Enter Critical cases"
                />
                <small></small>
              </div>
              <div class="field">
                <label for="deaths">Total Deaths:</label>
                <input
                  type="text"
                  id="deaths"
                  name="deaths"
                  placeholder="Enter total deaths"
                />
                <small></small>
              </div>
              <div class="field">
                <label for="recovered">Recovered Cases:</label>
                <input
                  type="text"
                  id="recovered"
                  name="recovered"
                  placeholder="Enter recovered cases"
                />
                <small></small>
              </div>
              <div className="btn-wrapperr">
                <button
                  name="formSubmit"
                  type="button"
                  onClick={() => {
                    submitForm();
                  }}
                >
                  ADD / UPDATE{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="wrapper">
        <div class="link_wrapper">
          <b href="#" onClick={goTofeed}>
            My Feed!
          </b>
          <div class="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 268.832 268.832"
            >
              <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z" />
            </svg>
          </div>
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="name">
          <Form.Label>Country</Form.Label>
          <Form.Control
            autoFocus
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br></br>
        </Form.Group>
        <div className="btn-wrapper">
          <Button onClick={() => fetchAPI(name)}>Search</Button>
          <Button className="btn-wrapperrr" onClick={() => fetchallAPI()}>
            All Countries
          </Button>
        </div>
      </Form>
      <div>
        <table className="taglist">
          <tbody>
            <tr>
              <th>CODE</th>
              <th>COUNTRY</th>
              <th>CONFIRMED</th>
              <th>CRITICAL</th>
              <th>DEATHS</th>
              <th>RECOVERED</th>
              <th>LASTUPDATE</th>
            </tr>
            {data && _.isArray(data)
              ? data.map(({ newDocument }) => (
                  <tr>
                    <td>{newDocument.code}</td>
                    <td>{newDocument.country}</td>
                    <td>{newDocument.confirmed}</td>
                    <td>{newDocument.critical}</td>
                    <td>{newDocument.deaths}</td>
                    <td>{newDocument.recovered}</td>
                    <td>{newDocument.lastupdate}</td>
                  </tr>
                ))
              : data &&
                data.newDocument && (
                  <tr>
                    <td>{data.newDocument.code}</td>
                    <td>{data.newDocument.country}</td>
                    <td>{data.newDocument.confirmed}</td>
                    <td>{data.newDocument.critical}</td>
                    <td>{data.newDocument.deaths}</td>
                    <td>{data.newDocument.recovered}</td>
                    <td>{data.newDocument.lastupdate}</td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
