const fs = require("fs");

const slackWorkspaceRoleFieldsFile = "data/workspace-role-fields.json";
const slackOrgRoleFieldsFile = "data/org-role-fields.json";

async function getWorkspaceRoleName(workspaceRoleValue) {
  // Return a blank string if the workspace has no value
  if (!workspaceRoleValue) {
    console.log("INFO: Workspace role not set. Returning!");
    return "";
  }

  // Get the workspace role data from the static JSON file
  const rawWorkspaceRoleData = fs.readFileSync(slackWorkspaceRoleFieldsFile, "utf-8");
  const workspaceRoleData = JSON.parse(rawWorkspaceRoleData).workspace_field_options;

  // Return the human-readable name with the prepended "Workspace"
  console.log("INFO: Returning workspace role");
  return "Workspace " + workspaceRoleData.find((element) => element.value === workspaceRoleValue).name;
}

async function getOrgRoleName(orgRoleValue) {
  // Return a blank string if the org has no value
  if (!orgRoleValue) {
    console.log("INFO: Org role not set. Returning!");
    return "";
  }

  // Get the org role data from the static JSON file
  const rawOrgRoleData = fs.readFileSync(slackOrgRoleFieldsFile, "utf-8");
  const orgRoleData = JSON.parse(rawOrgRoleData).custom_field_options;

  // Return the human-readable name with the prepended "Org"
  console.log("INFO: Returning org role");
  return "Org " + orgRoleData.find((element) => element.value === orgRoleValue).name;
}

async function getFormattedUserRole(orgRole, workspaceRole) {
  const rolesArray = [];

  // Create an array using the org and workspace roles
  if (orgRole || orgRole !== "") {
    rolesArray.push(orgRole);
  }

  if (workspaceRole || workspaceRole !== "") {
    rolesArray.push(workspaceRole);
  }

  // Return Org and/or Workspace role depending on the length of the array
  switch (rolesArray.length) {
    case 1:
      console.log("INFO: Returning org or workspace role, The other role is not set.");
      return rolesArray[0];
    case 2:
      console.log("INFO: Returning org and workspace role");
      return rolesArray[0] + "\n" + rolesArray[1];
    default:
      console.log("INFO: Returning no role set");
      return "No workspace or org role set!";
  }
}

module.exports = { getWorkspaceRoleName, getOrgRoleName, getFormattedUserRole };
