require("dotenv").config({ path: "../../.env" });

const withTM = require("next-transpile-modules")(["ui"]);

if(process.env.SENTRY_AUTH_TOKEN){
  const { withSentryConfig } = require('@sentry/nextjs');
  
  const sentryWebpackPluginOptions = {
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: true
  };
  
  module.exports = withTM(withSentryConfig({
    images: {
      domains: ['s2.googleusercontent.com'],
    },
    sentryWebpackPluginOptions
  }));
} else {
  module.exports = withTM({
    images: {
      domains: ['s2.googleusercontent.com'],
    }
  });
}
