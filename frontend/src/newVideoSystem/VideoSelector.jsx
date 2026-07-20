import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import FolderIcon from "@material-ui/icons/Folder";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import axios from "axios";
import io from "socket.io-client";
// import "./design.css";

const VideoSelector = () => {
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [remainingTime, setRemainingTime] = useState("");
  const [processingComplete, setProcessingComplete] = useState(false);
  const [showProcessingBox, setShowProcessingBox] = useState(false);
  const analysisBoxStyle = {
    border: "1px solid #007BFF",
    borderRadius: "5px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    width: "300px",
    margin: "0 auto",
    marginTop: "100px",
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/folders");
        const updatedFolders = response.data.map((folder) => ({
          ...folder,
          files: folder.files
            .filter((file) => file.name.endsWith(".MOV"))
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

    const socket = io("http://localhost:4000", { withCredentials: true });
    socket.on("video-progress-update", (data) => {
      setRemainingTime(data);
      setShowProcessingBox(true);
    });

    fetchFolders();
    return () => socket.disconnect();
  }, []);

  const handleFileSelection = async (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles((prevFiles) => prevFiles.filter((f) => f !== file));
      setFileData((prevData) =>
        prevData.filter((data) => data.name !== file.name)
      );
    } else {
      try {
        const response = await axios.get(file.url, { responseType: "blob" });
        const blob = new Blob([response.data], { type: "video/mp4" });
        setFileData((prevData) => [
          ...prevData,
          { name: file.name, data: blob },
        ]);
      } catch (error) {
        console.error("Failed to fetch video data:", error);
      }
      setSelectedFiles((prevFiles) => [...prevFiles, file]);
    }
  };
  const handleDownloadClick = () => {
    selectedFiles.forEach((file, index) => {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const handleProcessClick = async () => {
    const formData = new FormData();
    console.log(fileData);
    fileData.forEach((video, index) => {
      const file = new File([video.data], video.name, {
        type: "video/mp4",
      });
      formData.append("videos", file);
    });

    try {
      await axios.post(
        `http://localhost:4000/images/processVideos/${currentFolder._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProcessingComplete(true);
      setShowProcessingBox(false);
    } catch (error) {
      console.error("Failed to post videos:", error);
    }
  };

  return (
    <div className="selectbutton_image">
      {showProcessingBox ? (
        <div style={analysisBoxStyle}>
          {processingComplete ? (
            <>
              <h3>Done!</h3>
              <p>Your video processing is complete!</p>
              <p>Please check the original folder.</p>
            </>
          ) : (
            <>
              <p>Your video processing in progress…</p>
              <p>{remainingTime} secs to go</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="Button_image_selection_wrapper">
            <button
              className="Button_image_selection"
              onClick={() => setOpen(true)}
            >
              <div className="text_inside">Choose Video From The Folder</div>
            </button>
          </div>

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
                </div>
              ) : (
                <div className="file_folder_layout">
                  <h2 className="folder_header">
                    Files in {currentFolder.name}
                  </h2>
                  <div className="inside_file_folder_layout">
                    {currentFolder.files.map((file, index) => (
                      <div
                        key={index}
                        onClick={() => handleFileSelection(file)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: selectedFiles.includes(file)
                            ? "grey"
                            : "transparent",
                          margin: "10px 0",
                        }}
                      >
                        <FileIcon style={{ fontSize: 40, color: "white" }} />
                        <p>{file.name}</p>
                      </div>
                    ))}
                  </div>
                  {/* <button className="folder_select_all">Select All</button> */}
                  {selectedFiles.length == 0 && (
                    <button className="folder_next_disable" disable>
                      Next
                    </button>
                  )}
                  {selectedFiles.length > 0 && (
                    <>
                      <button
                        className="folder_next"
                        onClick={handleProcessClick}
                      >
                        Process
                      </button>
                      <button
                        className="folder_download" // You can style this new button in your CSS as required
                        onClick={handleDownloadClick}
                      >
                        Download
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default VideoSelector;
