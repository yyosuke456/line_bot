const ACCESS_TOKEN = "***";
const line_endpoint = "***";

function doPost(e) {
  const json = JSON.parse(e.postData.contents);

  //返信Token
  const reply_token = json.events[0].replyToken;
  if (typeof reply_token === "undefined") {
    return;
  }

  let message = json.events[0].message.text; //LINEに投稿されたメッセージはここ

  //★step2 メッセージを動的に作成
  let replyContent = makeMessage(message);

  if (replyContent == "") {
    return;
  }
  // メッセージを返信
  UrlFetchApp.fetch(line_endpoint, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: reply_token,
      messages: [
        {
          type: "text",
          text: replyContent,
        },
      ],
    }),
  });
  return ContentService.createTextOutput(
    JSON.stringify({ content: "post ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}

//★step2用
function makeMessage(message) {
  //★step3 GSSからランダムに取得
  if (message.indexOf("食レポ") != -1) {
    return getFromGssRepo();
  }
  if (message.indexOf("美味しい？") != -1) {
    return getFromGssRepo();
  }
  if (message.indexOf("おはよう") != -1) {
    return getFromGssGreet();
  }
  if (message.indexOf("こんにちは") != -1) {
    return getFromGssGreet();
  }
  if (message.indexOf("こんばんは") != -1) {
    return getFromGssGreet();
  }
  if (message.indexOf("はじめまして") != -1) {
    return getFromGssGreet();
  }
  if (message.indexOf("おやすみ") != -1) {
    return getFromGssGreet();
  }
  if (message.indexOf("名言") != -1) {
    return getFromGssMeigen();
  }
  if (message.indexOf("シート出して") != -1) {
    return "***";
  }
  if (message.indexOf("シート出して") != -1) {
    return "***";
  }
  if (message.indexOf("消臭力") != -1) {
    return "https://www.youtube.com/watch?v=N-39ZWTfXSk";
  }
  if (message.indexOf("ボカロの呪文") != -1) {
    return "食レポ\n美味しい？\nおはよう\nこんにちは\nこんばんは\nはじめまして\nおやすみ\n名言\nシート出して\nwiki\nを検索して\nで検索して\n消臭力";
  }
  if (message.indexOf("wiki") != -1) {
    return getWikiPageRandom();
  }
  if (message.indexOf("を検索して") != -1) {
    return getWikiSearchResult(message.replace("を検索して", ""));
  }
  if (message.indexOf("で検索して") != -1) {
    return getWikiSearchResult(message.replace("で検索して", ""));
  }
  if (message.indexOf("スタンプ") != -1) {
    pushImage();
    return "";
  }
  return "";
}

//★step3用
function getFromGssRepo() {
  const wordSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "食レポ"
  ); //→GSSのシート名を入れる
  const wordListRange = wordSheet.getRange(1, 1, wordSheet.getLastRow(), 1);
  const wordList = wordListRange.getValues();

  const index = Math.floor(Math.random() * wordList.length);
  const word = wordList[index][0];

  return word;
}

function getFromGssGreet() {
  const wordSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "挨拶"
  ); //→GSSのシート名を入れる
  const wordListRange = wordSheet.getRange(1, 1, wordSheet.getLastRow(), 1);
  const wordList = wordListRange.getValues();

  const index = Math.floor(Math.random() * wordList.length);
  const word = wordList[index][0];

  return word;
}

function getFromGssMeigen() {
  const wordSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "ボカロ名言"
  ); //→GSSのシート名を入れる
  const wordListRange = wordSheet.getRange(1, 1, wordSheet.getLastRow(), 1);
  const wordList = wordListRange.getValues();

  const index = Math.floor(Math.random() * wordList.length);
  const word = wordList[index][0];

  return word;
}

function getWikiPageRandom() {
  return getRedirect("http://ja.wikipedia.org/wiki/Special:Randompage");
}

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

function getWikiSearchResult(word) {
  return "https://ja.wikipedia.org/w/index.php?search=" + word;
}

//画像を送信
function pushImage() {
  //const url = "https://api.line.me/v2/bot/message/push";
  const imageHeaders = {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + ACCESS_TOKEN,
  };

  const postImageData = {
    messages: [
      {
        type: "image",
        originalContentUrl: "***",
        previewImageUrl: "***",
      },
    ],
  };

  const options = {
    method: "post",
    headers: imageHeaders,
    payload: JSON.stringify(postImageData),
  };

  return UrlFetchApp.fetch(line_endpoint, options);
}
