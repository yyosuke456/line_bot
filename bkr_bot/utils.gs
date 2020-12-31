// wikiで検索した結果を返す
function getWikiSearchResult(word) {
  return "https://ja.wikipedia.org/w/index.php?search=" + word;
}

// wikipediaのランダムなページを取得
function getWikiPageRandom() {
  return getRedirect("http://ja.wikipedia.org/wiki/Special:Randompage");
}

// リダイレクト先のページを取得
function getRedirect(url) {
  let response = UrlFetchApp.fetch(url, {
    followRedirects: false,
    muteHttpExceptions: false,
  });
  let redirectUrl = response.getHeaders()["Location"]; // undefined if no redirect, so...
  let responseCode = response.getResponseCode(); // ...it calls itself recursively...
  if (redirectUrl) {
    // ...if redirected...
    let nextRedirectUrl = getRedirect(redirectUrl);
    return nextRedirectUrl;
  } else {
    // ...until it's not
    return url;
  }
}

function saveMessageResponse(e) {
  /* スクリプトプロパティのオブジェクトを取得 */
  const prop = PropertiesService.getScriptProperties().getProperties();
  /* レスポンスを取得 */
  const response = e.postData.getDataAsString();
  const json = JSON.parse(response);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("log");
  /* スプレッドシートに書き込む */
  sheet.appendRow([new Date(), response]);
}

function getGroupId(e) {
  /* スクリプトプロパティのオブジェクトを取得 */
  const prop = PropertiesService.getScriptProperties().getProperties();
  /* レスポンスを取得 */
  const response = e.postData.getDataAsString();
  const json = JSON.parse(response);
  const type = json["events"][0]["source"]["type"];
  let groupId = "";
  if (type == "group") {
    groupId = json["events"][0]["source"]["groupId"];
  } else if (type == "room") {
    groupId = json["events"][0]["source"]["roomId"];
  } else if (type == "user") {
    groupId = json["events"][0]["source"]["userId"];
  }
  return groupId;
}
