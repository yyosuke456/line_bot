//const ACCESS_TOKEN = スクリプトのプロパティに移動
//const line_endpoint = スクリプトのプロパティに移動

// 受け取ったメッセージに応じてメッセージを送信
function doPost(e) {
  saveMessageResponse(e);
  const groupId = getGroupId(e);
  const json = JSON.parse(e.postData.contents);

  //返信Token
  const reply_token = json.events[0].replyToken;
  if (typeof reply_token === "undefined") {
    return;
  }

  let message = json.events[0].message.text; //LINEに投稿されたメッセージはここ

  //★step2 メッセージを動的に作成
  let replyContent = makeMessage(message, groupId);

  if (replyContent == "") {
    return;
  }
  // メッセージを返信
  const prop = PropertiesService.getScriptProperties().getProperties();
  UrlFetchApp.fetch(prop.line_endpoint, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + prop.ACCESS_TOKEN,
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

function makeMessage(message, groupId) {
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
  if (message.indexOf("あけおめ") != -1) {
    return "あけおめ";
  }
  if (message.indexOf("おみくじ") != -1) {
    return runOmikuji();
  }
  if (message.indexOf("名言") != -1) {
    return getFromGssMeigen();
  }
  if (message.indexOf("シート出して") != -1) {
    return PropertiesService.getScriptProperties().getProperties().SHEET_URL;
  }
  if (message.indexOf("消臭力") != -1) {
    return "https://www.youtube.com/watch?v=N-39ZWTfXSk";
  }
  if (message.indexOf("ボカロの呪文") != -1) {
    return "食レポ\n美味しい？\nおはよう\nこんにちは\nこんばんは\nはじめまして\nおやすみ\n名言\nシート出して\nwiki\nを検索して\nで検索して\n消臭力\nスタンプ\nまじか";
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
    pushmessage_image(groupId);
    return "";
  }
  if (message.indexOf("まじか") != -1) {
    majikaRoulette(groupId);
    return "";
  }
  if (
    message.indexOf("ここで働かせてください") != -1 ||
    message.indexOf("ここで働きたいんです") != -1
  ) {
    const reply = getRandomReply();
    if (reply == "わかったから静かにしておくれ！おおぉお～よ～しよし～……") {
      reply +=
        "契約書だよ。そこに名前を書きな。働かせてやる。その代わり嫌だとか、帰りたいとか言ったらすぐ子豚にしてやるからね。";
      replyFlg = 1;
    } else {
      replyFlg = 0;
    }
    logger.log(reply);
    return reply;
  }
  if (message.indexOf("ソースコード") != -1) {
    return "https://github.com/yyosuke456/line_bot/tree/master/bkr_bot";
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

//画像メッセージを送る
//画像の追加→'https://drive.google.com/uc?id=',//
function pushmessage_image(groupId) {
  const stampList = ["superCombo", "*"];
  const index = Math.floor(Math.random() * stampList.length);
  if (index == 0) {
    postUperCombo(groupId);
    return;
  }

  const stamp = stampList[index];
  postImage(groupId, stamp);
}

//スーパーコンボ
function postUperCombo(groupId) {
  postImage(groupId, "*");
  postImage(groupId, "*");
  postImage(groupId, "*");
}

function majikaRoulette(groupId) {
  const majikaList = ["***"];

  let shuffled = [];

  while (majikaList.length > 0) {
    n = majikaList.length;
    k = Math.floor(Math.random() * n);

    shuffled.push(majikaList[k]);
    majikaList.splice(k, 1);
  }

  postImage(groupId, shuffled[0]);
  postImage(groupId, shuffled[1]);
  postImage(groupId, shuffled[2]);
}

/* 画像メッセージを送る */
function postImage(groupId, stamp) {
  /* スクリプトプロパティのオブジェクトを取得 */
  const prop = PropertiesService.getScriptProperties().getProperties();
  return UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + prop.ACCESS_TOKEN, // スクリプトプロパティにトークンは事前に追加しておく
    },
    method: "POST",
    payload: JSON.stringify({
      to: groupId, // スクリプトプロパティに送信先IDは事前に追加しておく
      messages: [
        {
          type: "image",
          originalContentUrl: stamp,
          previewImageUrl: stamp,
        },
      ],
      notificationDisabled: false, // trueだとユーザーに通知されない
    }),
  });
}

function runOmikuji() {
  const fortuneList = ["大吉", "小吉", "中吉", "吉", "マジきち", "凶", "大凶"];
  const index = Math.floor(Math.random() * fortuneList.length);
  return fortuneList[index];
}
