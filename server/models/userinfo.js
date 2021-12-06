module.exports = class userinfo {
  constructor(
    username,
    email,
    password,
    service1,
    service2,
    service3,
    deadvertise
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.service1 = service1;
    this.service2 = service2;
    this.service3 = service3;
    this.deadvertise = deadvertise;
  }
};

// const mongoose = require("mongoose");

// const userinfo = new mongoose.Schema({
//   username: String,
//   password: String,
// });

// module.exports = mongoose.model("UserInfo", userinfo);
