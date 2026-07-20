// backend/models/folderModel.js

const mongoose = require("mongoose");

const folderSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  files: [
    {
      name: String,
    },
  ],
  left: {
    type: Number,
    default: 200,
  },
  top: {
    type: Number,
    default: 200,
  },
});

module.exports = mongoose.model("Folder", folderSchema);
