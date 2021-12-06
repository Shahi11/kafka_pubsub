module.exports = class CovidTallyPubSub {
    constructor(country, casesactive, casestotal, deathstotalDeaths, teststotalTests, day, time) {
        this.country = country
        this.casesactive = casesactive
        this.casestotal = casestotal
        this.deathstotalDeaths = deathstotalDeaths
        this.teststotalTests = teststotalTests
        this.day = day
        this.time = time
    }
}