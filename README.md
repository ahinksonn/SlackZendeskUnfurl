# Readme
Main App runs out of [App.js](https://slack-github.com/slack/ce-platform/blob/master/Zendesk%20Unfurler/app.js). Listeners are there for installation and Events.

Sending a user to `{{domainWhereThisGetsHosted}}/slack/install` will redirect them to the appropriate Oauth URL for the App.

Redirect URL in App Config needs to be `{{domainWhereThisGetsHosted}}/slack/auth`

Bot Event subscription should be set up for the App to `zendesk.com` at least (we probably want to get more specific with that path).

Installation logic runs at [installation/oauth.js](https://slack-github.com/slack/ce-platform/blob/master/Zendesk%20Unfurler/installation/oauth.js)
At the moment it just logs out token to console, that will need to store to a server.

Signature verification runs out of [security/signing.js](https://slack-github.com/slack/ce-platform/blob/master/Zendesk%20Unfurler/security/signing.js)
Simply returns `true` or `false`.
You can see an implementation in the Event listener at [app.js#56](https://slack-github.com/slack/ce-platform/blob/master/Zendesk%20Unfurler/app.js#L56)

At the moment receiving an event calls a largely empty function at [calls/unfurler.js](https://slack-github.com/slack/ce-platform/blob/master/Zendesk%20Unfurler/calls/unfurler.js)
That's just a barebones setup.

This depends on a `.env` file which should define at least:
* BOT_ACCESS_TOKEN
* CLIENT_ID
* CLIENT_SECRET
* SIGNING_SECRET