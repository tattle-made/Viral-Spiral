const { createCanvas } = require("canvas");
const canvasTxt = require("canvas-txt").default;
const fs = require("fs");
const { resolve } = require("path");
const data = require("./pages.json");
const { pipeline } = require("stream/promises");

const HEIGHT = 3508;
const WIDTH = 2480;
const GUTTER = 108;
const MARGIN = 25;
const CARD_NUM_HORIZONTAL = 3;
const CARD_NUM_VERTICAL = 3;
const CARD_WIDTH = WIDTH / CARD_NUM_HORIZONTAL - 2 * MARGIN;
const CARD_HEIGHT = HEIGHT / CARD_NUM_VERTICAL - 2 * MARGIN;

function initializeCanvas() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#000000";
  return { canvas, ctx };
}

function drawCard(ctx, width, height, origin, data) {
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 10;
  ctx.strokeRect(origin.x, origin.y, width - 2 * MARGIN, height - 2 * MARGIN);

  // header
  ctx.fillRect(origin.x, origin.y, width - 2 * MARGIN, 80);
  ctx.fillStyle = "#000000";
  //   ctx.font = "80px Raleway";
  canvasTxt.font = "Chilanka";
  canvasTxt.fontSize = 75;
  canvasTxt.align = "left";
  canvasTxt.lineHeight = 75 * 1.2;
  canvasTxt.justify = false;
  //   ctx.fillText(data.text, origin.x + 100, origin.y + 100);
  canvasTxt.drawText(
    ctx,
    data.text,
    origin.x + 80,
    origin.y + 80,
    width - (80 + 4 * MARGIN),
    height - (80 + 2 * MARGIN)
  );
}

// resetCanvas(ctx);

// Write "Awesome!"
// ctx.fillText(`${page.level_number} : ${page.level_name}`, 100);

/**
 * takes an array and transforms it into an array of arrays wherein each internal array's length is size
 * @param {*} arr
 * @param {*} size
 * @returns
 */
function batch(arr, size) {
  const a = [];
  for (let i = 0, j = 0; i < arr.length; i += size, j++) {
    a[j] = arr.slice(j * size, j * size + size);
  }
  return a;
}

(async function () {
  let canvases = [];
  const deckNums = Object.keys(data);
  for (i = 0; i < deckNums.length; i++) {
    const deckName = data[deckNums[i]].deck_name;
    const pageData = batch(data[deckNums[i]].cards, 9);
    for (j = 0; j < pageData.length; j++) {
      const { canvas, ctx } = initializeCanvas();
      for (k = 0; k < pageData[j].length; k++) {
        console.log(`here : ${j}_${k}`);
        const cardText = pageData[j][k];
        drawCard(
          ctx,
          CARD_WIDTH,
          CARD_HEIGHT,
          {
            x: (k % CARD_NUM_HORIZONTAL) * CARD_WIDTH + MARGIN,
            y: Math.floor(k / CARD_NUM_VERTICAL) * CARD_HEIGHT + MARGIN,
          },
          { text: cardText }
        );
      }
      canvases.push(canvas);
    }
  }
  for (let i = 0; i < canvases.length; i++) {
    await pipeline(
      canvases[i].createPNGStream(),
      fs.createWriteStream(__dirname + `/output/test_${i}.png`)
    );
  }
  // await testOnePage();
})();

async function testOnePage() {
  var cards = [
    "Cats found to cure hairfall, recent study shows",
    "My Cat Lover : He gives me what no human ever has, or can",
    "Cat-less loser laughed out of apartment building",
    "Cat fever grips nation!",
    "Cat wins landslide victory in rural council elections",
    "Cat got your tongue? 8 phrases that prove cats invented language",
    "Cat therapy proven to regrow lost limbs",
    "Cat human communication cracked! They appreciate our service",
    "Socks save family of four from freezing to death",
  ];
  const { canvas, ctx } = initializeCanvas();
  for (let i = 0; i < cards.length; i++) {
    const cardText = cards[i];
    drawCard(
      ctx,
      CARD_WIDTH,
      CARD_HEIGHT,
      {
        x: (i % CARD_NUM_HORIZONTAL) * CARD_WIDTH + 2 * MARGIN,
        y: Math.floor(i / CARD_NUM_VERTICAL) * CARD_HEIGHT + 2 * MARGIN,
      },
      { text: cardText }
    );
  }

  await pipeline(
    canvas.createPNGStream(),
    fs.createWriteStream(__dirname + `/output/design.png`)
  );
}
