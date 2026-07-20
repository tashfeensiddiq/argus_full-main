import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import FolderIcon from "@material-ui/icons/Folder";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import axios from "axios";
import { useHistory } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import "./design.css";

const ImageSelector = () => {
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const history = useHistory();

  useEffect(() => {
    // Fetch folders on mount
    const fetchFolders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/folders");
        const updatedFolders = response.data.map((folder) => ({
          ...folder,
          files: folder.files
            .filter((file) => file.name.endsWith(".png"))
            .map((file) => ({
              ...file,
              url: `http://localhost:4000/folders${file.path}`,
            })),
        }));
        setFolders(updatedFolders);
      } catch (error) {
        console.error("Failed to fetch folders:", error);
      }
    };

    fetchFolders();
  }, []);

  const handleDownload = async () => {
    const zip = new JSZip();

    // Add every selected file to the zip
    for (const file of selectedFiles) {
      try {
        const response = await axios.get(file.url, {
          responseType: "arraybuffer",
        });
        zip.file(file.name, response.data);
      } catch (error) {
        console.error("Failed to fetch image data for zipping:", error);
      }
    }

    // Generate the ZIP and trigger the download
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, "downloadedImages.zip");
    });
  };

  const handlePreview = (file) => {
    setPreviewImage(file);
  };

  const handleFileSelection = async (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles((prevSelectedFiles) =>
        prevSelectedFiles.filter((f) => f !== file)
      );
      setFileData((prevFileData) =>
        prevFileData.filter((data) => data.name !== file.name)
      );
    } else {
      // Fetch the actual image data and store as Blob
      try {
        console.log(file.url);
        const response = await axios.get(file.url, { responseType: "blob" });
        const blob = new Blob([response.data], { type: "image/png" }); // Assuming PNG, you might need to adjust the MIME type
        setFileData((prevFileData) => [
          ...prevFileData,
          { name: file.name, data: blob },
        ]);
      } catch (error) {
        console.error("Failed to fetch image data:", error);
      }

      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, file]);
    }
  };

  const handleNextClick = () => {
    // Redirect to /threeImages with the selected files as state
    history.push({
      pathname: "/threeImages",
      state: {
        uploadedFiles: selectedFiles,
        uploadedFileData: fileData,
        folderId: currentFolder._id,
      },
    });
  };

  return (
    <div className="selectbutton_image">
      <div className="Button_image_selection_wrapper">
        <button
          className="Button_image_selection"
          onClick={() => setOpen(true)}
        >
          <div className="text_inside">Choose Images From The Folder</div>
        </button>
      </div>

      {/* Modal to display the folders and files */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setCurrentFolder(null);
          setSelectedFiles([]);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="folder_layout">
          {!currentFolder ? (
            <div className="image_folder_layout">
              <>
                <h2 className="header_folder">Select a Folder</h2>
                {folders.map((folder) => (
                  <div
                    className="folders_layout"
                    key={folder._id}
                    onClick={() => setCurrentFolder(folder)}
                    style={{ cursor: "pointer", margin: "10px 0" }}
                  >
                    <FolderIcon style={{ fontSize: 40, color: "white" }} />
                    <p>{folder.name}</p>
                  </div>
                ))}
              </>
            </div>
          ) : (
            <div className="file_folder_layout">
              <h2 className="folder_header">Files in {currentFolder.name}</h2>
              <div className="inside_file_folder_layout">
                {currentFolder.files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "10px 0",
                    }}
                  >
                    <div
                      onClick={() => handleFileSelection(file)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: selectedFiles.includes(file)
                          ? "grey"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={file.url}
                        alt={file.name}
                        style={{ width: "50px", height: "50px" }}
                      />
                      {/* <FileIcon style={{ fontSize: 40, color: "white" }} /> */}
                      <p>{file.name}</p>
                    </div>
                    <button className="preview_button" onClick={() => handlePreview(file)}>Preview</button>
                  </div>
                ))}
              </div>
              {/* Display the Next button only when there are selected files */}
              {/* <button className = "folder_select_all" >Select All</button> */}
              {selectedFiles.length == 0 && (
                <button className="folder_next_disable" disable>
                  Next
                </button>
              )}
              {selectedFiles.length > 0 && (
                <>
                  <button className="folder_next" onClick={handleNextClick}>
                    Next
                  </button>
                  <button className="folder_download" onClick={handleDownload}>
                    Download
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </Modal>
      <Modal
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        aria-labelledby="image-preview-title"
        aria-describedby="image-preview-description"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ backgroundColor: "white", padding: "20px" }}>
          <img
            src={previewImage?.url}
            alt={previewImage?.name}
            style={{ maxWidth: "500px", maxHeight: "500px" }}
          />
          <p>{previewImage?.name}</p>
        </div>
      </Modal>
    </div>
  );
};

export default ImageSelector;
