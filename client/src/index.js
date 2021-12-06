import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./index.css";
import Login from "./login";
import Loginpage from "./login-page";
import Home from "./home";
import Signup from "./signup";
import Subscribe from "./subscribe";
import Feed from "./feed";

ReactDOM.render(
  <>
    <Router>
      <Switch>
        <Route path="/" exact>
          <Loginpage />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/login-page" exact>
          <Loginpage />
        </Route>
        <Route path="/signup" exact>
          <Signup />
        </Route>
        <Route path="/subscribe" exact>
          <Subscribe />
        </Route>
        <Route path="/feed" exact>
          <Feed />
        </Route>
      </Switch>
    </Router>
  </>,
  document.getElementById("root")
);
