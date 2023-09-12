const zendeskStatusEmoji = [
  {
    value: "open",
    emoji: ":zd-open:",
  },
  {
    value: "pending",
    emoji: ":zd-pending:",
  },
  {
    value: "hold",
    emoji: ":zd-on-hold:",
  },
  {
    value: "solved",
    emoji: ":zd-solved:",
  },
  {
    value: "new",
    emoji: ":zd-new:",
  },
  {
    value: "closed",
    emoji: ":zd-closed:",
  },
];
const priorityStatusEmoji = [
  {
    value: "low",
    emoji: ":low-priority-white-circle:",
  },
  {
    value: "normal",
    emoji: ":large_blue_circle:",
  },
  {
    value: "high",
    emoji: ":large_yellow_circle:",
  },
  {
    value: "urgent",
    emoji: ":red_circle:",
  },
];
const categoryEmoji = [
  {
    value: "feedback",
    emoji: ":feedback-91:",
  },
  {
    value: "question",
    emoji: ":question:",
  },
  {
    value: "problem",
    emoji: ":exclamation:",
  },
  {
    value: "incident",
    emoji: ":incident:",
  },
  {
    value: "bugged",
    emoji: ":bug:",
  },
];
const escalatedEmoji = [
  {
    value: "yes",
    emoji: ":jira-high:",
  },
  {
    value: "no",
    emoji: ":jira-normal:",
  },
];
const languageEmoji = [
  {
    value: "language_english",
    emoji: ":uk:",
  },
  {
    value: "language_french",
    emoji: ":france:",
  },
  {
    emoji: ":spanish:",
    value: "language_spanish",
  },
  {
    value: "language_german",
    emoji: ":german:",
  },
  {
    value: "language_other",
    emoji: ":globe:",
  },
];

// ToDo: Need to add better error checking to ensure that incorrect values do not error out
//#region Emoji Picker Functions
function StatusEmojiPicker(zendeskStatus) {
  console.log(zendeskStatus);
  return zendeskStatus !== null ? zendeskStatusEmoji.find((element) => element.value === zendeskStatus).emoji : ":heavy_minus_sign:";
}

function PriorityEmojiPicker(priorityStatus) {
  console.log(priorityStatus);
  return priorityStatus !== null ? priorityStatusEmoji.find((element) => element.value === priorityStatus).emoji : ":heavy_minus_sign:";
}

function CategoryEmojiPicker(category) {
  console.log(category);
  return category !== null ? categoryEmoji.find((element) => element.value === category).emoji : ":heavy_minus_sign:";
}

function EscalatedEmojiPicker(escalated) {
  console.log(escalated);
  return escalated !== null ? escalatedEmoji.find((element) => element.value === escalated).emoji : ":heavy_minus_sign:";
}

function LanguageEmojiPicker(language) {
  console.log(language);
  return language !== null ? languageEmoji.find((element) => element.value === language).emoji : ":heavy_minus_sign:";
}

//#endregion

//#region Get array functions
function GetZendeskStatusEmojiArray() {
  return zendeskStatusEmoji;
}

function GetPriorityStatusEmojiArray() {
  return priorityStatusEmoji;
}
function GetCategoryEmojiArray() {
  return categoryEmoji;
}
function GetEscalatedEmojiArray() {
  return escalatedEmoji;
}
function GetLanguageEmojiArray() {
  return languageEmoji;
}

//#endregion

module.exports = {
  StatusEmojiPicker,
  PriorityEmojiPicker,
  EscalatedEmojiPicker,
  LanguageEmojiPicker,
  CategoryEmojiPicker,
  GetZendeskStatusEmojiArray,
  GetPriorityStatusEmojiArray,
  GetCategoryEmojiArray,
  GetEscalatedEmojiArray,
  GetLanguageEmojiArray,
};
