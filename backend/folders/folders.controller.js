const express = require("express");
const Folder = require("./folder.model");
const multer = require("multer");

const router = express.Router();

const path = require("path");

router.get("/image/:filename", (req, res) => {
  const filename = req.params.filename;

  const filePath = path.join(__dirname, "../", "newFolderSystem", filename);

  res.sendFile(filePath);
});

router.get("/", async (req, res) => {
  try {
    const folders = await Folder.find();
    const modifiedFolders = folders.map((folder) => {
      return {
        ...folder._doc,
        files: folder.files.map((file) => ({
          name: file.name,
          path: `/image/${file.name}`,
        })),
      };
    });
    res.json(modifiedFolders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/rename", async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    folder.name = name;
    await folder.save();

    res.json({ message: "Folder renamed successfully", folder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./newFolderSystem"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/:id/upload", upload.array("file"), async (req, res) => {
  if (req.files && req.files.length > 0) {
    try {
      const folder = await Folder.findById(req.params.id);

      const newFiles = req.files.map((file) => ({
        name: file.filename,
      }));

      folder.files.push(...newFiles);
      await folder.save();

      res.json({ message: `Successfully uploaded ${req.files.length} files!` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(400).json({ message: "No files uploaded" });
  }
});

router.post("/", async (req, res) => {
  const folder = new Folder({
    name: req.body.name,
    left: req.body.left,
    top: req.body.top,
  });

  try {
    const newFolder = await folder.save();
    res.status(201).json(newFolder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (req.body.left) folder.left = req.body.left;
    if (req.body.top) folder.top = req.body.top;
    await folder.save();
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add more routes for file upload and other functionalities as required.

module.exports = router;
