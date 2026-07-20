async function autoAnalysis(req, res) {
  try {
    await bg_images_folderRemoval();

    const options = {
      mode: "text",
      pythonPath: "./env/bin/python",
      pythonOptions: ["-u"],
      scriptPath: "./scripts",
      args: ["./uploads"],
    };

    const results = await new Promise((resolve, reject) => {
      PythonShell.run("autobg_regular.py", options, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    const workbook = XLSX.readFile(
      "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/datasheet/demo.xlsx"
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

async function autoAnalysisWithSocket(req, res) {
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
      pythonPath: "./env/bin/python",
      pythonOptions: ["-u"],
      scriptPath: "./scripts",
      args: ["./uploads"],
    };
    const pyShell = new PythonShell(scriptName, options);

    pyShell.on("message", function (message) {
      // This will receive the output from the Python script (the remaining time)
      io.emit("updateProgress", { message });
    });
    await new Promise((resolve, reject) => {
      pyShell.end(function (err) {
        if (err) reject(err);
        resolve();
      });
    });
    const workbook = XLSX.readFile(
      "/Users/sakura/Desktop/Argus 1.21/Argus_1.21_Back_end/bg_images/datasheet/demo.xlsx"
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
