module.exports = class CovidTally {
  constructor(
    country,
    code,
    confirmed,
    recovered,
    critical,
    deaths,
    lastupdate
  ) {
    this.country = country;
    this.code = code;
    this.confirmed = confirmed;
    this.recovered = recovered;
    this.critical = critical;
    this.deaths = deaths;
    this.lastupdate = lastupdate;
  }
};

// const mongoose = require("mongoose");

// const covidSchema = new mongoose.Schema({
//   country: String,
//   code: String,
//   confirmed: Number,
//   recovered: Number,
//   critical: Number,
//   deaths: Number,
//   lastupdate: String,
// });

// module.exports = mongoose.model("CovidTally", covidSchema);
