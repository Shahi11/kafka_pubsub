import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./signup.css";
import Swal from "sweetalert2";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const Swal = require("sweetalert2");
  function validateForm() {
    return (
      email.length > 0 && password.length > 0 && password === confirmPassword
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(event.target[0].value);
    const res = fetch("http://localhost:5000/lsds/login/add", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: event.target[0].value,
        email: event.target[1].value,
        password: event.target[2].value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res == true) {
          Swal.fire({
            title: "SUCCESS",
            text: "Thanks for signing Up!!",
            icon: "success",
            buttons: ["NO", "YES"],
          }).then(function (isConfirm) {
            if (isConfirm) {
              window.location.href = "/login-page";
            } else {
              //if no clicked => do something else
            }
          });
        } else {
          Swal.fire({
            title: "SUCCESS",
            text: "Thanks for signing Up!! You will now be redirected to login portal",
            icon: "success",
            buttons: ["NO", "YES"],
          }).then(function (isConfirm) {
            if (isConfirm) {
              window.location.href = "/login-page";
            } else {
              //if no clicked => do something else
            }
          });
        }
      })
      .catch((err) => console.log("My error, ", err));
  }

  const goToSignup = () => {
    window.location.href = "/login-page";
  };

  return (
    <div>
      <div class="topnav">
        <a class="active" href="#login-page">
          COVID TRACKER
        </a>
        <a href="#news  "> News </a>
        <a href="#contact  "> Contact </a>
        <a href="#about   "> About </a>
        <a href="#Donate   "> Donate </a>
        <div className="btn-wrapperr">
          <Button block size="lg" onClick={goToSignup}>
            Login
          </Button>
        </div>
      </div>
      <div className="Signup">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username" size="lg">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="email" size="lg">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password" size="lg">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword" size="lg">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
          </Form.Group>
          <div className="btn-wrapper">
            <Button block size="lg" type="submit" disabled={!validateForm()}>
              SignUp
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
