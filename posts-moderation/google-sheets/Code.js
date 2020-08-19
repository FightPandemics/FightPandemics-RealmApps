const MAX_CELL_LENGTH = 50000;
const REALM_BASE_URL = "https://webhooks.mongodb-realm.com/api/client/v2.0/app";
const POSTS_PER_PAGE = 100;
// to be defined within "Posts" spreadsheet
const POSTS_DATA_NAMED_RANGE = "PostsData"
const POSTS_PAGE_INPUT_NAMED_RANGE = "PostsPageInput";
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
  clearDataContents();
  SpreadsheetApp.flush()
  getPostsFromRealm();
}

function clearDataContents() {
  var sheet = SpreadsheetApp.getActiveSheet(); 
  sheet.getRange(POSTS_DATA_NAMED_RANGE).clearContent();
  sheet.getRange(POSTS_DATA_NAMED_RANGE).getCell(1,1).setValue("Loading...");  
}

function getPostsFromRealm() {  
  var scriptProperties = PropertiesService.getScriptProperties();
  var realmAppId = scriptProperties.getProperty(REALM_APP_ID_KEY);
  var realmWebhookSecret = scriptProperties.getProperty(REALM_WEBHOOK_SECRET_KEY);

  var sheet = SpreadsheetApp.getActiveSheet(); 
  var page = sheet.getRange(POSTS_PAGE_INPUT_NAMED_RANGE).getValue();
  var skip = (page - 1) * POSTS_PER_PAGE;
  
  var response = UrlFetchApp.fetch(
    `${REALM_BASE_URL}/${realmAppId}/service/http-service/incoming_webhook/get-posts?secret=${realmWebhookSecret}&limit=${POSTS_PER_PAGE}&skip=${skip}`
  );

  var postsText = response.getContentText();
  var posts = JSON.parse(postsText).map(postToRow);
  
  if (posts.length) {
    sheet.getRange(POSTS_DATA_NAMED_RANGE).offset(0, 0, posts.length).setValues(posts);
  } else {
    sheet.getRange(POSTS_DATA_NAMED_RANGE).getCell(1,1).setValue("No posts.");  
  }
}
