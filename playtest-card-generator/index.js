const creds = require("./credentials.json"); // the file saved above
const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(
  "1HScDf7_AHZCEa_FliryY99yZbqkHRCNpPYdIdyKWAnQ"
);
const { parseSheet } = require("./parser");
const fs = require("fs").promises;
const { stat } = fs;

const CARD_PER_PAGE = 9;

(async function () {
  let data = [];

  try {
    await stat("./data.json");
    console.log("data file exists. skipping google sheet download and parsing");
    data = require("./data.json");
  } catch (err) {
    console.log("Data file does not exists. Fetching from Google Sheet");
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheetCount = doc.sheetCount;

    for (let i = 0; i < sheetCount; i++) {
      const sheet = doc.sheetsByIndex[i];
      const deck = await parseSheet(sheet);
      data.push(deck);
    }

    console.log(data);
    await fs.writeFile("data.json", JSON.stringify(data));
  }

  const pages = {};
  data.map((datum, ix) => {
    pages[ix] = {
      deck_name: `${datum.level_number} : ${datum.level_name}`,
      cards: [],
    };
    const sections = Object.keys(datum.cards);
    sections.map((section) => {
      const cards = Object.keys(datum.cards[section]);
      cards.map((card) => {
        datum.cards[section][card].map((item) => {
          pages[ix]["cards"].push(item);
        });
      });
    });
  });

  await fs.writeFile("pages.json", JSON.stringify(pages));
})();
