const axios = require("axios");
// Get Client ID
const client_id = process.env.CLIENT_ID;
// Get Client Secret
const client_secret = process.env.CLIENT_SECRET;

// Make the Oauth call to exchange the code, and log the tokens from the response
function oauthIt(code) {
  // console.log("Called")
  axios
    .get("https://slack.com/api/oauth.v2.access", {
      params: {
        code: code,
        client_id: client_id,
        client_secret: client_secret,
      },
    })
    .then(function (body) {
      var response = body.data;
      if (response.ok) {
        console.log("Installation Success");
        if (response.is_enterprise_install) {
          console.log("Enterprise Install");
          console.log("Enterprise ID: " + response.enterprise.id);
        } else {
          console.log("Workspace Install");
          console.log("Workspace ID: " + response.team.id);
        }
        if (response.access_token) {
          process.env.BOT_TOKEN = response.access_token;
        }
      } else {
        console.log("Installation Failure");
        console.log(response.error);
      }
    })
    .catch(function (err) {
      console.log(err);
      console.log("Installation Failure");
    });
}

// Redirect to Oauth installation URL
function authURL(res) {
  var url = "https://slack.com/oauth/v2/authorize";
  var botScopes = ["links:read", "links:write"];
  res.redirect(url + "?client_id=" + client_id + "&scope=" + botScopes + "&user_scope=");
}

module.exports = { oauthIt, authURL };
