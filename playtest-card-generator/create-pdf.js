const PDFDocument = require("pdfkit");
const fs = require("fs");
const cliProgress = require("cli-progress");
const progressBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
);

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream("output/file.pdf"));

progressBar.start(44, 0);
for (let i = 0; i < 45; i++) {
  progressBar.update(i);
  doc.image(`output/test_${i}.png`, 0, 0, {
    width: 2480 / 4.3,
  });
  doc.addPage();
}

doc.end();
// process.exit();
