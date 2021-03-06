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

function runOmikuji() {
  const fortuneList = ["大吉", "小吉", "中吉", "吉", "マジきち", "凶", "大凶"];
  const index = Math.floor(Math.random() * fortuneList.length);
  return fortuneList[index];
}

function getRandomReply() {
  const replyList = [
    "なんであたしがおまえを雇わなきゃならないんだい！？見るからにグズで！甘ったれで！泣き虫で！頭の悪い小娘に、仕事なんかあるもんかね！お断りだね。これ以上穀潰しを増やしてどうしようっていうんだい！それとも……一番つらーーいきつーーい仕事を死ぬまでやらせてやろうかぁ……？",
    "うるさいね、静かにしておくれ。",
    "馬鹿なおしゃべりはやめとくれ。そんなひょろひょろに何が出来るのさ。",
    "まァだそれを言うのかい！",
    "だァーーーまァーーーれェーーー！！！",
    "おっ おっ おっ おっ おっ おっ おっ",
    "わかったから静かにしておくれ！おおぉお～よ～しよし～……",
    "わかったから静かにしておくれ！おおぉお～よ～しよし～……",
  ];
  const index = Math.floor(Math.random() * replyList.length);
  return replyList[index];
}

function testYubba() {
  let reply = getRandomReply();
  if (reply.indexOf("わかったから静かにしておくれ") != -1) {
    reply +=
      "契約書だよ。そこに名前を書きな。働かせてやる。その代わり嫌だとか、帰りたいとか言ったらすぐ子豚にしてやるからね。";
    replyFlg = 1;
  } else {
    replyFlg = 0;
  }
  return reply;
}

function testSetSeetVal() {
  const sheetName = "flg";
  const range = "B2";
  const val = 1;
  setSheetVal(sheetName, range, val);
}
function testGetSeetVal() {
  const sheetName = "flg";
  const range = "B2";
  const flg = getSheetVal(sheetName, range);
  Logger.log(flg);
}

function setSheetVal(sheetName, range, val) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  sheet.getRange(range).setValue(val);
}

function getSheetVal(sheetName, range) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  return sheet.getRange(range).getValue();
}
