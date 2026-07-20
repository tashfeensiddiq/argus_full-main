const db = require("_helpers/db");
const fs = require("fs");
const path = require("path");

///code underneath is critical

async function uploadImage(req, res) {
  try {
    const { title, description, userId } = req.body;

    const { path, mimetype, originalname } = req.file;

    const image = new db.Image({
      userId,
      title,
      description,
      originalname,
      file_path: path,
      file_mimetype: mimetype,
    });
    await image.save();
    res.send("image uploaded successfully.");
  } catch (error) {
    res.status(400).send("Error while uploading file. Try again later.");
  }
}
async function getImages(req, res) {
  const userId = req.params.userId;

  try {
    const image = await db.Image.find({ userId });
    const sortedByCreationDate = image.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.send(sortedByCreationDate);
  } catch (error) {
    res.status(400).send("Error while getting list of files. Try again later.");
  }
}
async function downloadImage(req, res) {
  const imageId = req.params.id;
  console.log(imageId);
  try {
    const image = await db.Image.findById(imageId);
    res.set({
      "Content-Type": image.file_mimetype,
    });
    res.sendFile(path.join(__dirname, "..", image.file_path));
  } catch (err) {
    res.status(400).send("Error while downloading file. Try again later.");
  }
}
async function saveCorrosionImage(req, res) {
  const imageId = req.body.id;
  const image64 = req.body.base64;
  const corrosionPercentage = req.body.percentage;
  const base64Data = image64.replace(/^data:image\/png;base64,/, "");
  try {
    const image = await db.Image.findById(imageId);

    const originalImageName = path
      .basename(image.file_path)
      .replace(/\.[^/.]+$/, "");
    const corrosionImageName = originalImageName + "_corrosion";
    const corrosionImagePath = "uploads/" + corrosionImageName + ".png";

    await fs.writeFileSync(
      corrosionImagePath,
      base64Data,
      "base64",
      function (err) {
        console.log(err);
      }
    );
    image.corrosion_file_name = image.originalname + "_corrosion";
    image.corrosion_file_path = corrosionImagePath;
    image.corrosion_file_percentage = corrosionPercentage;
    await image.save();
    res.send("Corrosion image uploaded successfully.");
  } catch (err) {
    res
      .status(400)
      .send("Error while uploading corrosion file. Try again later.");
  }
}
async function saveSevereImage(req, res) {
  const imageId = req.body.id;
  const image64 = req.body.base64;
  const severePercentage = req.body.percentage;
  const base64Data = image64.replace(/^data:image\/png;base64,/, "");
  try {
    const image = await db.Image.findById(imageId);

    const originalImageName = path
      .basename(image.file_path)
      .replace(/\.[^/.]+$/, "");
    const severeImageName = originalImageName + "_severe";
    const severeImagePath = "uploads/" + severeImageName + ".png";
    console.log(severeImagePath);
    console.log(image.file_path);
    await fs.writeFileSync(
      severeImagePath,
      base64Data,
      "base64",
      function (err) {
        console.log(err);
      }
    );
    image.severe_file_name = image.originalname + "_severe";
    image.severe_file_path = severeImagePath;
    image.severe_file_percentage = severePercentage;
    await image.save();
    res.send("Corrosion image uploaded successfully.");
  } catch (err) {
    res
      .status(400)
      .send("Error while uploading corrosion file. Try again later.");
  }
}

async function deleteFile(req, res) {
  const imageId = req.params.id;
  console.log(imageId);
  try {
    const image = await db.Image.findById(imageId);
    await fs.unlinkSync(image.file_path);
    try {
      if (fs.existsSync(image.corrosion_file_path)) {
        await fs.unlinkSync(image.corrosion_file_path);
      }
    } catch (err) {
      console.error(err);
    }
    try {
      if (fs.existsSync(image.severe_file_path)) {
        await fs.unlinkSync(image.severe_file_path);
      }
    } catch (err) {
      console.error(err);
    }
    db.Image.deleteOne({ _id: imageId }, function (err) {
      if (err) return handleError(err);
      // deleted at most one tank document
    });
    res.send("Delete successfully");
  } catch (err) {
    res.status(400).send("Error while deleting file. Try again later.");
  }
}
module.exports = {
  getImages,
  saveSevereImage,

  uploadImage,
  downloadImage,
  saveCorrosionImage,
  deleteFile,
};
