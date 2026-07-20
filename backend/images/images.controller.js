const express = require("express");
const router = express.Router();
const imageAnalyzeService = require("./imageAnalyze.service");
const imageService = require("./image.service");
const upload = require("_middleware/multer");
const uploadMultiple = require("_middleware/multiple-multer");
//routes
router.post("/corrosion", imageAnalyzeService.corrosion);
router.post("/imageComparison", imageAnalyzeService.comparison);
// router.post(
//   "/autoAnalysis",
//   uploadMultiple.array("images"),
//   imageAnalyzeService.autoAnalysis
// ); //no back ground removal
router.post(
  "/autoAnalysis/:folderId",
  uploadMultiple.array("images"),
  imageAnalyzeService.autoAnalysis
);
router.post(
  "/processVideos/:folderId",
  uploadMultiple.array("videos"),
  imageAnalyzeService.processVideo
);
// router.post(
//   "/autoBackAnalysis",
//   uploadMultiple.array("images"),
//   imageAnalyzeService.autoBackAnalysis
//   // imageAnalyzeService.emptyFolder
//   // imageAnalyzeService.archive
// );

// router.post(
//   "/folderImagesAutoAnalysis",
//   imageAnalyzeService.folderImageAutoAnalysis
// );

router.post(
  "/imageBgCropping",

  imageAnalyzeService.imageBgCropping
);
router.post(
  "/imageBgRemoveDrawing",
  imageAnalyzeService.imageBgRemoveDrawing
  // imageAnalyzeService.afterbg_calculation
);
router.post(
  "/afterbg_calculation",
  // uploadMultiple.array("images"),
  imageAnalyzeService.afterbg_calculation
);
router.post(
  "/imagePercentageCompare",
  imageAnalyzeService.imagePercentageCompare
);

// router.post("/add", imageService.addImage);
// router.get("/", imageService.getImages);
router.get("/getImages/:userId", imageService.getImages); //fetch images
// router.get("/:imageId", imageService.getImageById);
router.get("/download/:id", imageService.downloadImage); //send image to front end
// router.put(
//   "/upload/:imageId",
//   // upload.array("originalImage"),
//   upload.single("originalImage"),
//   imageService.addOriginalImagesById
// );
// router.put("/delete/:imageId", imageService.removeOriginalImageById);

router.post(
  "/upload",
  upload.single("image"),
  imageService.uploadImage,
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
); //upload image
router.put("/corrosionImageSave", imageService.saveCorrosionImage);
router.put("/severeImageSave", imageService.saveSevereImage);
router.delete("/fileDelete/:id", imageService.deleteFile);

module.exports = router;
