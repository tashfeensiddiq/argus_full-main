const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    file_path: {
      type: String,
      required: true,
    },
    file_mimetype: {
      type: String,
      required: true,
    },
    corrosion_file_name: {
      type: String,
      required: false,
    },
    corrosion_file_path: {
      type: String,
      required: false,
    },
    severe_file_name: {
      type: String,
      required: false,
    },
    severe_file_path: {
      type: String,
      required: false,
    },
    corrosion_file_percentage: {
      type: String,
      required: false,
    },
    severe_file_percentage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// imageSchema.method.toJSON = function () {
//   const result = this.toObject();
//   delete result.originalImage;
//   return result;
// };

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model("Image", imageSchema);
