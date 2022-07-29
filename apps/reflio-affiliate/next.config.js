require("dotenv").config({ path: "../../.env" });

const withTM = require("next-transpile-modules")(["ui"]);

module.exports = withTM({
  images: {
    domains: ['s2.googleusercontent.com'],
  }
});