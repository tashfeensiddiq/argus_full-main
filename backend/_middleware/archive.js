const path = require("path");
const archiver = require("archiver");
const fs = require("fs");

const archive = (folderName) => {
  const zipName = folderName + ".zip";
  const source = path.join(__dirname, "tmp", folderName);
  const out = path.join(__dirname, "tmp", zipName);

  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  archive
    .directory(source, false)
    .on("error", (err) => {
      throw err;
    })
    .pipe(stream);

  stream.on("close", () => console.log("closed"));
  archive.finalize();
  console.log("zip file created");
};
module.exports = archive;
