const multer = require("multer");
const db = require("_helpers/db");

const uploadMultiple = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const { folderName, userEmail } = req.body;

      cb(null, `./Temp_Image_Upload`);
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    },
  }),
  // limits: {
  //   fileSize: 10000000, // max file size 10MB = 10000000 bytes
  // },
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(
        /\.(jpeg|jpg|png|pdf|doc|docx|JPG|xlsx|xls|mp4|avi)$/
      )
    ) {
      return cb(
        new Error(
          "only upload files with jpg, jpeg, png, pdf, doc, docx, JPG,xslx, xls, mp4 format."
        )
      );
    }
    cb(undefined, true); // continue with upload
  },
});

// const upload = multer({ storage: storage });
module.exports = uploadMultiple;
