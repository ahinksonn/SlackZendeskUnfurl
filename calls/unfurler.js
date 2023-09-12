const fs = require("fs");
const axios = require("axios");
const { CategoryEmojiPicker, EscalatedEmojiPicker, PriorityEmojiPicker, LanguageEmojiPicker, StatusEmojiPicker } = require("../helpers/emojiHelper");
const { getWorkspaceRoleName, getOrgRoleName, getFormattedUserRole } = require("../helpers/fieldHelper");

const bot_token = process.env.BOT_TOKEN;

async function unfurl(zendeskData, slackData) {
  const ticketFields = await getTicketFields(zendeskData);
  const unfurlPayload = constructUnfurlPayload(zendeskData, slackData, ticketFields);
  const heads = {
    headers: { Authorization: "Bearer " + bot_token },
  };
  axios
    .post("https://slack.com/api/chat.unfurl", unfurlPayload, heads)
    .then(function (response) {
      if (response.data.ok === false) {
        console.log("API ERROR!");
      } else {
        console.log("SUCCESS!");
      }
      console.log(response.data);
    })
    .catch(function (error) {
      console.log("HTTP ERROR!");
      console.log(error);
    });
}

async function getTicketFields(zendeskData) {
  const rawAbout = zendeskData.ticket.custom_fields.find((element) => element.id == 28874248).value;
  const encodedEnterpriseID = zendeskData.ticket.custom_fields.find((element) => element.id == 44428147).value;
  const encodedTeamID = zendeskData.ticket.custom_fields.find((element) => element.id == 28885047).value;
  const encodedUserID = zendeskData.ticket.custom_fields.find((element) => element.id == 28884967).value;
  const rawWorkspaceRole = zendeskData.ticket.custom_fields.find((element) => element.id == 360004237832).value;
  const rawOrgRole = zendeskData.ticket.custom_fields.find((element) => element.id == 360004253231).value;
  const ticketCategory = zendeskData.ticket.custom_fields.find((element) => element.id == 29452157).value;
  const ticketEscalated =
    zendeskData.ticket.custom_fields.find((element) => element.id == 5116759291155) !== undefined ? zendeskData.ticket.custom_fields.find((element) => element.id == 5116759291155).value : null;
  const ticketLanguage = zendeskData.ticket.custom_fields.find((element) => element.id == 25217426).value;
  const { type: ticketType, status: ticketStatus, priority: ticketPriority } = zendeskData.ticket;

  // Parse the roles into human-readable text
  const workspaceRole = await getWorkspaceRoleName(rawWorkspaceRole);
  const orgRole = await getOrgRoleName(rawOrgRole);

  const userRole = await getFormattedUserRole(orgRole, workspaceRole);

  // Parse about field into more human-readable text
  const parsedAboutField = parseAboutField(rawAbout);
  const ticketFields = {
    about: parsedAboutField,
    org: encodedEnterpriseID,
    team: encodedTeamID,
    user: encodedUserID,
    userRole: userRole,
    category: ticketCategory,
    escalated: ticketEscalated,
    type: ticketType,
    status: ticketStatus,
    priority: ticketPriority,
    language: ticketLanguage,
  };
  console.log("INFO: Fields", ticketFields);
  return ticketFields;
}

function parseAboutField(about) {
  const jsonFilePath = "data/ticket-fields-about.json";
  const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
  const parsedData = JSON.parse(jsonData);

  if (!about) return "About not selected";

  // If about matches an expected tag, return matchingData.value
  const matchingData = parsedData.find((item) => item.tag === about);
  if (matchingData) return matchingData.value;

  // If about exists and no match found, attempt regex parsing and return formatted string
  const words = about.split(/_+/);
  const formattedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  const formattedString = formattedWords.join(" ");
  return formattedString;
}

function constructUnfurlPayload(zendeskData, slackData, ticketFields) {
  payload = {
    channel: slackData.channel,
    ts: slackData.ts,
    unfurls: {
      [slackData.zendeskUrl]: {
        blocks: [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `<!date^${Math.floor(Date.parse(zendeskData.ticket.created_at)) / 1000}^Created {date_num} {time_secs}| Created date> | <!date^${
                  Math.floor(Date.parse(zendeskData.ticket.updated_at)) / 1000
                }^Last Updated {date_num} {time_secs}|Last Updated Time>`,
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*About*: ${ticketFields.about}`,
              },
              {
                type: "mrkdwn",
                text: `*Team*: <https://mc.tinyspeck.com/mc/team.php?id=${ticketFields.team}|${ticketFields.team}>`,
              },
              {
                type: "mrkdwn",
                text: `*Role*: ${ticketFields.userRole}`,
              },
              {
                type: "mrkdwn",
                text: `*User*: <https://mc.tinyspeck.com/mc/user.php?id=${ticketFields.user}&team_id=${ticketFields.team}|${ticketFields.user}>`,
              },
            ],
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `:zendesk: *Category*: ${CategoryEmojiPicker(ticketFields.category)} |  *Priority*: ${PriorityEmojiPicker(ticketFields.priority)}  |  *Status*: ${StatusEmojiPicker(
                  ticketFields.status
                )}  |  *Escalated*: ${EscalatedEmojiPicker(ticketFields.escalated)}  | ${LanguageEmojiPicker(ticketFields.language)}`,
              },
            ],
          },
        ],
      },
    },
  };
  return payload;
}

module.exports = { unfurl };
