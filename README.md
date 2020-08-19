# FightPandemics MongoDB Realm Apps

This repo includes services built in [MongoDB Realm](https://www.mongodb.com/realm) to provide access to data stored in MongoDB Atlas for the [main FightPandemics app](https://github.com/FightPandemics/FightPandemics/).

These apps are intended for use by FightPandemics team members and generally. They may be stop gap solutions until the desired functionality can be built into the main app itself.

The front-end is currently Google Sheets. The code is defined within a `google-sheets/Code.js` file.

## posts-moderation

This app provides access to post content for FightPandemics team members to review the content for abuse. "Sourced by FightPandemics" posts are excluded.

### Google Sheet Usage

#### Granting Access

The app is made available through a Google Sheet stored in the FightPandemics accounts Google Drive. Since G Suite is not being used users will be given access to this specific sheet by email invite.

1. Get the email of the user requiring access for moderation.
2. Open the "FightPandemics Moderation" sheet
3. Click the "Share" button (top-right)
4. Enter the email and add as an "Editor" and click "Send"

#### Initial Usage & Granting Script Permissions

Since G Suite is not being used the script must be granted permission to run by each invited user.

1. Click the link in invitation email
2. Once the sheet fully loads click "Get Posts"
3. Click "Continue" in prompt asking for permission to run
4. A pop-up will open. Select your account & click "Advanced"
5. Click "Go to fightpandemics-posts-moderation (unsafe)"

![Grant Permissions](images/posts-mod-grant-permissions.png?raw=true)

#### Getting Posts

The "Get Posts" button will get 100 posts at a time with the most recent posts displayed first. "Sourced by FightPandemics" posts are excluded.

It will clear all the content under the column headers in the "Posts" sheet, so any content to be persisted should be entered elsewhere.

1. If desired, to get a different page (each chunk of 100 in descending order by creation timestamp), enter the page number in the corresponding cell (currently B1)
2. Click "Get Posts". Depending on connection speed the data should be refreshed in less than a second.

Note: If "Posts on Page" is less than 100 then it is the last page.

#### Realm App Config Properties

These shouldn't change but if need be you can change these properties in the Google Sheet to match the Realm App. Get the values from a Realm app developer or have them complete these steps

1. Click "Change Realm App Config Properties" button
2. Enter `REALM_APP_ID` (this should start with "posts-moderation-") and click "Ok"
3. Enter `REALM_WEBHOOKS_SECRET` and click "Ok"
4. Click "Get Posts" to confirm there are no errors

### Development

The most important code to update are:

1. `posts-moderation/realm-config/services/http-service/incoming_webhooks/get-posts/source.js`
2. `posts-moderation/google-sheets/Code.js`

Typically these would be edited & iterated on in MongoDB Realm & Google Sheets respectively.

They are saved here for source control purposes.

#### MongoDB Realm

NOTE: There are import/export functions available via [realm-cli](https://docs.mongodb.com/realm/deploy/realm-cli-reference/) that generated all the files under realm-config. The steps to most easily keep the realm app & repo in sync are WIP. Until then the copy & paste is suggested:

1. Login into to MongoDB Atlas and select the "Production" project.
1. Go to Realm
1. Go to 3rd Party Services > http-service > get-posts
1. Edit the function & save
1. Click "Review & Deploy" then "Deploy"
1. Test with Google Sheets and iterate as required
1. Save the file to `posts-moderation/realm-config/services/http-service/incoming_webhooks/get-posts/source.js`

#### Google Sheet

1. Access the Google Sheet as described [above](#posts-moderation)
1. Go to Tools > Script editor
1. Edit the Code.gs file, save & test as required
1. Save the updated file to `posts-moderation/google-sheets/Code.js`
