/**
 *
 * @param {*} sheet
 * @param {*} origin : is the index of columns to start with
 * @returns
 */
function parseSection(sheet, totalRows, origin) {
  let cards = {};
  currentSet = "UNDEFINED";
  for (var i = 0; i < totalRows; i++) {
    const cell = sheet.getCell(i, origin).value;
    // console.log({ cell, type: typeof cell });

    if (typeof cell === "number") {
      if (cell === 1) {
        var deckname = sheet.getCell(i - 1, origin + 1).value;
        decknameUnderscored = deckname
          .split(" ")
          .map((item) => item.toLowerCase())
          .join("_");
        // console.log({ decknameUnderscored });
        cards[decknameUnderscored] = [];
        currentSet = decknameUnderscored;
      }

      cards[currentSet].push(sheet.getCell(i, origin + 1).value);
    } else {
    }
  }
  return cards;
}

async function parseSheet(sheet) {
  const totalRows = sheet.rowCount;

  await sheet.loadCells(`A1:E${totalRows}`);
  var deck = {};
  deck["level_number"] = sheet.getCellByA1("A2").value;
  deck["level_name"] = sheet.getCellByA1("B2").value;
  deck["cards"] = {};

  const section_A = parseSection(sheet, totalRows, 0);
  const section_B = parseSection(sheet, totalRows, 3);

  deck["cards"]["section_a"] = section_A;
  deck["cards"]["section_b"] = section_B;

  return deck;
}

module.exports = { parseSheet };
