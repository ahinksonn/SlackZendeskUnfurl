const axios = require("axios");
const { unfurl } = require("./unfurler"); // Import unfurl function

const username = process.env.USERNAME;
const token = process.env.ZTOKEN;

async function processSlackEvent(event) {
  const {message_ts:ts, channel:channel, links} = event;

  for (const link of links) {
    const zendeskUrl = link.url;
    const zendeskTicketId = zendeskUrl.split('/').pop();
    const zendeskApiUrl = `https://slack1447178842.zendesk.com/api/v2/tickets/${zendeskTicketId}.json`;

    const zendeskResponse = await axios.get(zendeskApiUrl, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Basic ${Buffer.from(`${username}/token:${token}`).toString('base64')}`
      },
    });

    unfurl(zendeskResponse.data, { ts, channel, links, zendeskUrl }); // Call unfurl function
  }
}

console.log(processSlackEvent)

module.exports = processSlackEvent;
