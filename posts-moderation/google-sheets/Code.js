const MAX_CELL_LENGTH = 50000;
const REALM_BASE_URL = "https://webhooks.mongodb-realm.com/api/client/v2.0/app";
// to be set & reset as necessary as scriptProperties 
const REALM_APP_ID_KEY = "REALM_APP_ID";
const REALM_WEBHOOK_SECRET_KEY = "REALM_WEBHOOK_SECRET";

function setRealmAppProperties() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var realmAppId = scriptProperties.getProperty(REALM_APP_ID_KEY);
  var realmWebhookSecret = scriptProperties.getProperty(REALM_WEBHOOK_SECRET_KEY);

  var ui = SpreadsheetApp.getUi();
  var realmAppIdResponse = ui.prompt(`Change ${REALM_APP_ID_KEY} from "${realmAppId}" to:`, ui.ButtonSet.OK);
  scriptProperties.setProperty(REALM_APP_ID_KEY, realmAppIdResponse.getResponseText());
  var realmWebhookSecretResponse = ui.prompt(`Change ${REALM_WEBHOOK_SECRET_KEY} from "${realmWebhookSecret}" to:`, ui.ButtonSet.OK);
  scriptProperties.setProperty(REALM_WEBHOOK_SECRET_KEY, realmWebhookSecretResponse.getResponseText());
}

function postToRow(post) {
  return [
    post.title,
    post.link,
    post.content.length > MAX_CELL_LENGTH
      ? post.content.substr(0, MAX_CELL_LENGTH)
      : post.content,
    post.createdAt,
    post.updatedAt,
  ];
}

function getPosts() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var realmAppId = scriptProperties.getProperty(REALM_APP_ID_KEY);
  var realmWebhookSecret = scriptProperties.getProperty(REALM_WEBHOOK_SECRET_KEY);
  
  var response = UrlFetchApp.fetch(
    `${REALM_BASE_URL}/${realmAppId}/service/http-service/incoming_webhook/get-posts?secret=${realmWebhookSecret}`
  );

  var postsText = response.getContentText();
  var posts = JSON.parse(postsText).map(postToRow);

  var sheet = SpreadsheetApp.getActiveSheet();
  if (posts.length) {
    sheet.getRange(2, 1, posts.length, posts[0].length).setValues(posts);
  } else {
    sheet.getRange(2, 1).setValue("No posts");
  }
}
