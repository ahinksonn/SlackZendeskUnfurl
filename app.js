// Initialize app
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const install = require("./installation/oauth.js");
const security = require("./security/signing.js");
const processSlackEvent = require("./calls/slackEvents.js");

// Define parsing mode for received requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());

// Installation

// Redirect to Oauth Authorize URL
app.get("/slack/install", function (req, res) {
  install.authURL(res);
});

// Request URL, processing receipt of 'code'
app.get("/slack/auth", function (req, res) {
  var code = req.query.code;
  console.log("Received auth code: " + code);
  try {
    install.oauthIt(code);
    res.status(200).send("Installation complete.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Installation failed.");
  }
});

// Handle Events API events
app.all("/slack/events", async function (req, res) {
  console.log("Received an event: ", req.body); // Log the received event

  // Check if this is an initial URL verification request
  if (req.body.challenge) {
    console.log("Challenge received: " + req.body.challenge);
    // Respond to the challenge
    res.status(200).send(req.body.challenge);
    console.log("Challenge responded with 200 and " + req.body.challenge);
    return;
  }

  let signatureVerified = security.verify(req.headers[`x-slack-signature`], req.headers["x-slack-request-timestamp"], req.body);
  console.log("Signature Verified: " + signatureVerified);

  if (signatureVerified === true) {
    res.status(200).send("ok");
    processSlackEvent(req.body.event);
  }
});

// Listen for requests
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("App is listening on port " + listener.address().port);
});
