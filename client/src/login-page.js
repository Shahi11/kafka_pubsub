import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./login-page.css";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(event.target[0].value);
    const res = fetch("http://localhost:5000/lsds/login/user", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: event.target[0].value,
        password: event.target[1].value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res == true) {
          Swal.fire({
            title: "Welcome Back",
            text: "Logging you in",
            icon: "success",
            buttons: ["NO", "YES"],
          }).then(function (isConfirm) {
            if (isConfirm) {
              window.location.href = "/login";

              sessionStorage.setItem("USER_EMAIL", event.target[0].value);
            } else {
              //if no clicked => do something else
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Wrong Credentials! Please try again!",
            footer: '<a href="">Why do I have this issue?</a>',
          });
        }
      })
      .catch((err) => console.log("My error, ", err));
  }

  const goToSignup = () => {
    window.location.href = "/signup";
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
        <div className="btn-wrapperrrr">
          <Button block size="lg" onClick={goToSignup}>
            Sign Up
          </Button>
        </div>
      </div>

      <div className="Login">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="btn-wrapper">
            <Button block size="lg" type="submit" disabled={!validateForm()}>
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
