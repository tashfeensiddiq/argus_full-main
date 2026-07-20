module.exports = {
  corrosion,
  comparison,
  autoAnalysis,
  emptyFolder,
  // folderImageAutoAnalysis,
  imageBgCropping,
  imageBgRemoveDrawing,
  afterbg_calculation,
  imagePercentageCompare,
  processVideo,
};

const { PythonShell } = require("python-shell");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const XLSX = require("xlsx");
const db = require("_helpers/db");
const Folder = require("../folders/folder.model");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const socket = require("../socket");
const io = socket.getIO();

async function corrosion(req, res) {
  let jsonData = {
    img: req.body.data.img,
    points: req.body.data.points,
    apiKey: req.body.data.apiKey,
  };

  //api key for normal user xyxF9&2G9R@AkFQ-
  //api key for Eserv sjkd#xFkndi13d
  if (jsonData.apiKey != "xyxF9&2G9R@AkFQ-") {
    res.send("Error : ", "Not authenticated!");
  }

  let options = {
    mode: "json",
    scriptPath: "./scripts",
    // pythonPath: "/usr/local/bin/python3",
    pythonPath: "./env/bin/python",
  };

  const pyshell = new PythonShell("test_13.py", options);

  pyshell.send(jsonData);

  pyshell.on("message", (result) => {
    res.json({ result });
  });

  pyshell.end((err) => {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    }
  });
}

async function comparison(req, res) {
  let jsonData = {
    img: req.body.data.img,
    apiKey: req.body.data.apiKey,
    pixels: req.body.data.total_pixels,
    edges: req.body.data.edges,
    totalCorrosion: req.body.data.total_corrosion,
  };

  // console.log("hi");
  console.log(jsonData.totalCorrosion);
  if (jsonData.apiKey != "xyxF9&2G9R@AkFQ-") {
    res.send("Error : ", "Not authenticated!");
  }

  let options = {
    mode: "json",
    scriptPath: "./scripts",
    // pythonPath: "/usr/local/bin/python3",
    pythonPath: "./env/bin/python",
  };

  const pyshell = new PythonShell("severe_corrosion_new.py", options);

  pyshell.send(jsonData);

  pyshell.on("message", (result) => {
    console.log("running python");
    res.json({ result });
  });

  pyshell.end((err) => {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    }
  });
}

async function emptyFolder(fileSaveDir) {
  // const source_After = path.join(__dirname, "..", "Images_After_Analyze");
  const source_After = fileSaveDir;
  const source_Before = path.join(__dirname, "..", "Images_To_Analyze");
  try {
    await fse.emptyDir(source_After);
    await fse.emptyDir(source_Before);
  } catch (err) {
    console.log(err);
  }
}
async function archive(req, res, fileSaveDir) {
  const zipName = "Images_Result" + ".zip";
  const source = fileSaveDir;
  const out = path.join(__dirname, "..", zipName);

  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  archive
    .directory(source, false)
    .on("error", (err) => {
      throw err;
    })
    .pipe(stream);

  stream.on("close", () => {
    emptyFolder();
    // res.download(path.join(__dirname, "..", zipName));
    res.set({
      "Content-Type": "application/zip",
    });
    res.sendFile(path.join(__dirname, "..", zipName));
  });
  archive.finalize();
  console.log("zip file created");
}
async function bg_images_folderRemoval() {
  const bg_path = path.join(__dirname, "..", "bg_images/bg_path");
  const calculated = path.join(__dirname, "..", "bg_images/calculated");
  const original = path.join(__dirname, "..", "bg_images/original");
  const datasheet = path.join(__dirname, "..", "bg_images/datasheet");
  const mask = path.join(__dirname, "..", "bg_images/mask");
  try {
    await fse.emptyDir(bg_path);
    await fse.emptyDir(calculated);
    await fse.emptyDir(original);
    await fse.emptyDir(datasheet);
    await fse.emptyDir(mask);
  } catch (err) {
    console.log(err);
  }
}
async function video_calculated_folderRemoval() {
  const video_calculated = path.join(__dirname, "..", "video_calculated");
  try {
    await fse.emptyDir(video_calculated);
  } catch (err) {
    console.log(err);
  }
}
async function images_To_Analyze_folderRemoval() {
  const imageAnalyzePath = path.join(__dirname, "..", "Images_To_Analyze");
  try {
    await fse.emptyDir(imageAnalyzePath);
  } catch (err) {
    console.log(err);
  }
}

async function autoAnalysis(req, res) {
  try {
    await bg_images_folderRemoval();
    console.log("1");

    let scriptName; // Variable to hold the script name

    if (req.body.selectedOption === "withDetection") {
      scriptName = "autobg_removal_prediction.py";
    } else {
      scriptName = "autobg_regular.py";
    }

    const options = {
      mode: "text",
      pythonPath: "./env/Scripts/python",
      pythonOptions: ["-u"],
      scriptPath: "./scripts",
      args: ["./uploads"],
    };
    const pyShell = new PythonShell(scriptName, options);

    pyShell.on("message", function (message) {
      // This will receive the output from the Python script (the remaining time)
      if (message !== "Segmentation Models: using `keras` framework.") {
        console.log(message);
        io.emit("progress-update", message);
      }
    });
    await new Promise((resolve, reject) => {
      pyShell.end(function (err) {
        if (err) reject(err);
        resolve();
      });
    });
    const workbook = XLSX.readFile(
      "C:/Users/deepm/Desktop/new_argus/Argus 1.21 Back, August 16,2023/bg_images/datasheet/demo.xlsx"
    );
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const percentages = sheetData.map((row) => ({
      filename: row.filename,
      calculatedPercentage: row["calculated percentage"],
    }));

    const bg_Path = path.join(__dirname, "..", "bg_images/bg_path");
    const calculated_Path = path.join(__dirname, "..", "bg_images/calculated");
    const original_Path = path.join(__dirname, "..", "bg_images/original");
    const datasheet_Path = path.join(__dirname, "..", "bg_images/datasheet");
    const newFolderPath = path.join(__dirname, "..", "newFolderSystem");

    const bgFiles = await readdir(bg_Path);
    const calculatedFiles = await readdir(calculated_Path);
    const originalFiles = await readdir(original_Path);
    const datasheetFiles = await readdir(datasheet_Path);

    const bgPathFileArray = [];
    const calculatedPathFileArray = [];
    const originalPathFileArray = [];
    const datasheetPathFileArray = [];
    const pathJson = {
      bgPathFileArray,
      calculatedPathFileArray,
      originalPathFileArray,
      datasheetPathFileArray,
      percentages,
    };

    bgFiles.forEach((file) => {
      if (!file.startsWith(".")) {
        bgPathFileArray.push(generateUrl("bg_path", file));
      }
    });

    for (let file of calculatedFiles) {
      if (!file.startsWith(".")) {
        const oldPath = path.join(calculated_Path, file);
        const newPath = path.join(newFolderPath, file);

        await fse.copy(oldPath, newPath);
        calculatedPathFileArray.push(generateUrl("calculated", file));
      }
    }

    originalFiles.forEach((file) => {
      if (!file.startsWith(".")) {
        originalPathFileArray.push(generateUrl("original", file));
      }
    });

    datasheetFiles.forEach((file) => {
      if (!file.startsWith(".")) {
        datasheetPathFileArray.push(generateUrl("datasheet", file));
      }
    });

    const folderId = req.params.folderId;
    const folder = await Folder.findById(folderId);

    folder.files.push(
      ...calculatedPathFileArray.map((filePath) => ({
        name: path.basename(filePath),
      }))
    );

    await folder.save();

    images_To_Analyze_folderRemoval();
    res.send(pathJson);
  } catch (error) {
    console.error("An error occurred:", error);

    res.status(500).send("Internal Server Error");
  }
}

async function processVideo(req, res) {
  try {
    // 1. Cleanup old videos.
    await video_calculated_folderRemoval();
    console.log("1");
    console.log("Old videos cleaned up.");

    // 2. Run the Python script.
    const options = {
      mode: "text",
      pythonPath: "./env/bin/python",
      pythonOptions: ["-u"],
      scriptPath: "./scripts",
      args: ["./uploads"],
    };

    const pyShell = new PythonShell("video_processing.py", options);

    pyShell.on("message", function (message) {
      // Emit progress to the frontend.
      if (message !== "Segmentation Models: using `keras` framework.") {
        io.emit("video-progress-update", message);
      }
    });

    await new Promise((resolve, reject) => {
      pyShell.end(function (err) {
        if (err) reject(err);
        resolve();
      });
    });

    console.log("Python script finished processing videos.");

    // 3. Copy processed videos from video_calculated to newFolderSystem.
    const videoCalculatedPath = path.join(__dirname, "..", "video_calculated");
    const newFolderPath = path.join(__dirname, "..", "newFolderSystem");

    const calculatedVideos = await fse.readdir(videoCalculatedPath);

    for (let video of calculatedVideos) {
      if (!video.startsWith(".")) {
        const oldPath = path.join(videoCalculatedPath, video);
        const newPath = path.join(newFolderPath, video);

        await fse.copy(oldPath, newPath);
      }
    }

    console.log("Processed videos copied to newFolderSystem.");

    // 4. Update the database.
    const folderId = req.params.folderId;
    const folder = await Folder.findById(folderId);

    folder.files.push(
      ...calculatedVideos.map((videoPath) => ({
        name: path.basename(videoPath),
      }))
    );

    await folder.save();

    console.log("Database updated with new video names.");

    // 5. Cleanup the Images_To_Analyze folder.
    images_To_Analyze_folderRemoval();
    console.log("Images_To_Analyze folder cleaned up.");

    // Send a success response.
    res.send("Video processing completed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
}

// async function autoBackAnalysis(req, res) {
//   await bg_images_folderRemoval();
//   let options = {
//     mode: "text",
//     pythonPath: "./env/bin/python",
//     pythonOptions: ["-u"], // get print results in real-time
//     scriptPath: "./scripts",
//     args: ["./uploads"],
//   }; //no jsonData
//   // let options = {
//   //   mode: "json",
//   //   pythonPath: "./env/bin/python",
//   //   pythonOptions: ["-u"], // get print results in real-time
//   //   scriptPath: "./scripts",
//   // }; //
//   let edge_detection = 1;
//   let jsonData = {
//     edge_detection,
//   };
//   // const pyshell = new PythonShell("autobg_regular.py", options);
//   // pyshell.send(jsonData);
//   // pyshell.on("message", (result) => {
//   //   console.log(result);
//   // });
//   PythonShell.run(
//     "autobg_removal_prediction.py",
//     // "autobg_regular.py",
//     options,
//     // pyshell.end((err) => {
//     //   if (err) {
//     //     console.log(err);
//     //   }
//     // })
//     function (err, results) {
//       if (err) throw err;
//       const workbook = XLSX.readFile(
//         "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/datasheet/demo.xlsx"
//       );
//       const sheetName = workbook.SheetNames[0];
//       const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       const percentages = sheetData.map((row) => ({
//         filename: row.filename,
//         calculatedPercentage: row["calculated percentage"],
//       }));

//       // results is an array consisting of messages collected during execution
//       const bg_Path = path.join(__dirname, "..", "bg_images/bg_path");
//       const calculated_Path = path.join(
//         __dirname,
//         "..",
//         "bg_images/calculated"
//       );
//       const original_Path = path.join(__dirname, "..", "bg_images/original");
//       const datasheet_Path = path.join(__dirname, "..", "bg_images/datasheet");

//       const bgPathFileArray = [];
//       const calculatedPathFileArray = [];
//       const originalPathFileArray = [];
//       const datasheetPathFileArray = [];
//       const pathJson = {
//         bgPathFileArray,
//         calculatedPathFileArray,
//         originalPathFileArray,
//         datasheetPathFileArray,
//         percentages,
//       };
//       images_To_Analyze_folderRemoval();

//       fs.readdir(bg_Path, function (err, files) {
//         if (err) {
//           return console.log("Unable to scan directory: " + err);
//         }

//         files.forEach(function (file) {
//           if (!file.startsWith(".")) {
//             bgPathFileArray.push(generateUrl("bg_path", file));
//           }
//         });

//         fs.readdir(calculated_Path, function (err, files) {
//           if (err) {
//             return console.log("Unable to scan directory: " + err);
//           }

//           files.forEach(function (file) {
//             if (!file.startsWith(".")) {
//               calculatedPathFileArray.push(generateUrl("calculated", file));
//             }
//           });

//           fs.readdir(original_Path, function (err, files) {
//             if (err) {
//               return console.log("Unable to scan directory: " + err);
//             }

//             files.forEach(function (file) {
//               if (!file.startsWith(".")) {
//                 originalPathFileArray.push(generateUrl("original", file));
//               }
//             });
//             fs.readdir(datasheet_Path, function (err, files) {
//               if (err) {
//                 return console.log("Unable to scan directory: " + err);
//               }

//               files.forEach(function (file) {
//                 if (!file.startsWith(".")) {
//                   datasheetPathFileArray.push(generateUrl("datasheet", file));
//                 }
//               });

//               res.send(pathJson);
//             });
//           });
//         });
//       }); //bg_path loop through
//     }
//   );
// } //background removal
async function imageBgCropping(req, res) {
  const url = req.body.image;
  const urlObject = new URL(url);
  const desiredPart = urlObject.pathname;

  const imagepath = path.join(__dirname, "..", desiredPart);
  const rect = req.body.rect.map((num) => Math.floor(num));

  // let rect = [1, 1, 280, 280];
  console.log(rect);
  let jsonData = {
    imagepath,
    rect,
  };

  let options = {
    mode: "json",
    pythonPath: "./env/bin/python",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./scripts",
  };

  // PythonShell.run("removbg_rect.py", options, function (err, results) {
  //   if (err) throw err;
  //   console.log(err);
  //   // results is an array consisting of messages collected during execution
  //   const directoryPath = path.join(__dirname, "..", "uploads");

  //   // archive(req, res, directoryPath);
  // });
  const pyshell = new PythonShell("removbg_rect.py", options);

  pyshell.send(jsonData);

  pyshell.on("message", (result) => {
    console.log(result);
  });

  await pyshell.end((err) => {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    }
    afterbg_calculation(req, res, imagepath);
  });
}

async function imageBgRemoveDrawing(req, res) {
  const url = req.body.image;
  const urlObject = new URL(url);
  const desiredPart = urlObject.pathname;
  const flag = req.body.flag;
  const imagepath = path.join(__dirname, "..", desiredPart);

  const backGroundDecimal = req.body.blackPoints.map((point) => [
    point.x,
    point.y,
  ]);
  const backGround = backGroundDecimal.map((pair) =>
    pair.map((num) => Math.floor(num))
  );
  const foreGroundDecimal = req.body.whitePoints.map((point) => [
    point.x,
    point.y,
  ]);
  const foreGround = foreGroundDecimal.map((pair) =>
    pair.map((num) => Math.floor(num))
  );
  let jsonData = {
    imagepath,
    backGround,
    foreGround,
    flag,
  };

  let options = {
    mode: "json",
    pythonPath: "./env/bin/python",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./scripts",
  };

  const pyshell = new PythonShell("removeBg_line_new_update.py", options);

  pyshell.send(jsonData);

  pyshell.on("message", (result) => {
    console.log(result);
  });

  await pyshell.end((err) => {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    }
    // afterbg_calculation(req, res, imagepath);
    const bg_path_address = url.replace("original", "bg_path");
    res.json({
      finalOutput: bg_path_address,
    });
  });
}

async function afterbg_calculation(req, res) {
  const url = req.body.image;
  const urlObject = new URL(url);
  const desiredPart = urlObject.pathname;

  const imagePath = path.join(__dirname, "..", desiredPart);
  console.log(imagePath);
  let jsonData = {
    imagePath,
  };

  let options = {
    mode: "json",
    pythonPath: "./env/bin/python",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./scripts",
  };

  const pyshell = new PythonShell("afterbg_calculation.py", options);
  // const pyshell = new PythonShell("generate_pdf.py", options);

  pyshell.send(jsonData);

  pyshell.on("message", (result) => {
    console.log(result);
  });

  pyshell.end((err) => {
    if (err) {
      console.log(err);
    }
    const bg_calculated_address = url.replace("original", "calculated");
    res.json({ finalOutput: bg_calculated_address });
  });
}

async function imagePercentageCompare(req, res) {
  const imagePaths = req.body.checkedItems.map((item) => item.name);
  const flag = req.body.flag;

  // const imagePaths = extractFileNames(urls);

  let options = {
    mode: "json",
    pythonPath: "./env/bin/python",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./scripts",
  };

  let jsonData = {
    imagePaths,
    flag,
  };
  const pyshell = new PythonShell("combine_with_image.py", options);
  pyshell.send(jsonData);

  pyshell.on("message", (result) => {
    console.log(result);
  });
  pyshell.end((err) => {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    }
    res.json({
      finalOutput: "http://localhost:4000/bg_images/datasheet/compare.png",
    });
  });
}

function generateUrl(subfolder, videoFile) {
  // Get the base URL of the server
  const serverUrl = `http://localhost:4000`;

  // The URL for the video file will be the server URL plus the path to the file
  // on the server's filesystem. You will need to figure out how to construct this
  // path based on your specific server configuration.
  const videoPath = `/bg_images/${subfolder}/${videoFile}`;
  const videoUrl = `${serverUrl}${videoPath}`;

  return videoUrl;
}
const getImagePaths = (urls) => {
  const imagePaths = [];

  for (let i = 0; i < urls.length; i++) {
    const currentUrl = new URL(urls[i]);
    const imageTempPath = currentUrl.pathname;
    const imagePath = path.join(__dirname, "..", imageTempPath);
    imagePaths.push(imagePath);
  }

  return imagePaths;
};
const extractFileNames = (urls) => {
  const fileNames = [];
  for (const url of urls) {
    const fileName = url.split("/").pop();
    fileNames.push(fileName);
  }

  return fileNames;
};

async function folderImageAutoAnalysis(req, res) {
  const folder = await db.Folder.findById(req.body.folderId);

  const filterdImages = folder.images.filter((image) =>
    req.body.folderImageId.includes(image._id)
  );

  const destinationPath = path.join(__dirname, "..", "/Images_To_Analyze/");

  filterdImages.forEach(async (image) => {
    // const finalPath = destinationPath + "/" + image.imageName;
    console.log(destinationPath);
    await fs.copyFileSync(image.image_path, destinationPath + image.imageName);
  });
  autoAnalysis(req, res);
}
