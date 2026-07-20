// import React, { useState, useEffect } from "react";
// import Modal from "@material-ui/core/Modal";
// import FolderIcon from "@material-ui/icons/Folder";
// import FileIcon from "@material-ui/icons/InsertDriveFile";
// import axios from "axios";
// import { useHistory } from "react-router-dom";
// import "./design.css";

// const ExcelSelector = () => {
//   const [open, setOpen] = useState(false);
//   const [folders, setFolders] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [currentFolder, setCurrentFolder] = useState(null);
//   const [fileData, setFileData] = useState([]);

//   const history = useHistory();

//   useEffect(() => {
//     const fetchFolders = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/folders");
//         const updatedFolders = response.data.map((folder) => ({
//           ...folder,
//           files: folder.files
//             .filter((file) => file.name.endsWith(".xlsx"))
//             .map((file) => ({
//               ...file,
//               url: `http://localhost:4000/folders${file.path}`,
//             })),
//         }));
//         setFolders(updatedFolders);
//       } catch (error) {
//         console.error("Failed to fetch folders:", error);
//       }
//     };

//     fetchFolders();
//   }, []);

//   const handleFileSelection = async (file) => {
//     if (selectedFiles.includes(file)) {
//       setSelectedFiles((prevSelectedFiles) =>
//         prevSelectedFiles.filter((f) => f !== file)
//       );
//       setFileData((prevFileData) =>
//         prevFileData.filter((data) => data.name !== file.name)
//       );
//     } else {
//       // Fetch the actual Excel data and store as Blob
//       try {
//         const response = await axios.get(file.url, { responseType: "blob" });
//         const blob = new Blob([response.data], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         }); // MIME type for xlsx
//         setFileData((prevFileData) => [
//           ...prevFileData,
//           { name: file.name, data: blob },
//         ]);
//       } catch (error) {
//         console.error("Failed to fetch Excel data:", error);
//       }

//       setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, file]);
//     }
//   };

//   const handleNextClick = () => {
//     // Redirect to /threeImages with the selected files as state
//     history.push({
//       pathname: "/dashboard_analysis",
//       state: {
//         uploadedFiles: selectedFiles,
//         uploadedFileData: fileData,
//       },
//     });
//   };

//   return (
//     <div className="selectbutton_excel">
//       <div className="Button_image_selection_wrapper">
//         <button
//           className="Button_image_selection"
//           onClick={() => setOpen(true)}
//         >
//           <div className="text_inside">Choose Excel From The Folder</div>
//         </button>
//       </div>

//       <Modal
//         open={open}
//         onClose={() => {
//           setOpen(false);
//           setCurrentFolder(null);
//           setSelectedFiles([]);
//         }}
//         aria-labelledby="simple-modal-title"
//         aria-describedby="simple-modal-description"
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <div className="folder_layout">
//           {!currentFolder ? (
//             <div className="excel_folder_layout">
//               <h2 className="header_folder">Select a Folder</h2>
//               {folders.map((folder) => (
//                 <div
//                   className="folders_layout"
//                   key={folder._id}
//                   onClick={() => setCurrentFolder(folder)}
//                   style={{ cursor: "pointer", margin: "10px 0" }}
//                 >
//                   <FolderIcon style={{ fontSize: 40, color: "white" }} />
//                   <p>{folder.name}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <>
//               <h2>Excel Files in {currentFolder.name}</h2>
//               {currentFolder.files.map((file, index) => (
//                 <div
//                   key={index}
//                   onClick={() => handleFileSelection(file)}
//                   style={{
//                     cursor: "pointer",
//                     backgroundColor: selectedFiles.includes(file)
//                       ? "grey" // Indicate selection with a different background
//                       : "transparent",
//                     margin: "10px 0",
//                   }}
//                 >
//                   <FileIcon style={{ fontSize: 40, color: "white" }} />
//                   <p>{file.name}</p>
//                 </div>
//               ))}
//               {selectedFiles.length === 1 && (
//                 <button className="folder_next" onClick={handleNextClick}>
//                   Next
//                 </button>
//               )}
//             </>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default ExcelSelector;

import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import FolderIcon from "@material-ui/icons/Folder";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import axios from "axios";
import { useHistory } from "react-router-dom";
// import "./design.css";

const ExcelSelector = () => {
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [fileData, setFileData] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/folders");
        const updatedFolders = response.data.map((folder) => ({
          ...folder,
          files: folder.files
            .filter((file) => file.name.endsWith(".xlsx"))
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

  const handleFileSelection = async (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles((prevSelectedFiles) =>
        prevSelectedFiles.filter((f) => f !== file)
      );
      setFileData((prevFileData) =>
        prevFileData.filter((data) => data.name !== file.name)
      );
    } else {
      // Fetch the actual Excel data and store as Blob
      try {
        const response = await axios.get(file.url, { responseType: "blob" });
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }); // MIME type for xlsx
        setFileData((prevFileData) => [
          ...prevFileData,
          { name: file.name, data: blob },
        ]);
      } catch (error) {
        console.error("Failed to fetch Excel data:", error);
      }

      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, file]);
    }
  };

  const handleNextClick = () => {
    // Redirect to /threeImages with the selected files as state
    history.push({
      pathname: "/dashboard_analysis",
      state: {
        uploadedFiles: selectedFiles,
        uploadedFileData: fileData,
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
          <div className="text_inside">Choose Excel File From The Folder</div>
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
                Excel Files in {currentFolder.name}
              </h2>
              <>
                <div className="inside_file_folder_layout">
                  {currentFolder.files.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => handleFileSelection(file)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: selectedFiles.includes(file)
                          ? "grey" // Indicate selection with a different background
                          : "transparent",
                        margin: "10px 0",
                      }}
                    >
                      <FileIcon style={{ fontSize: 40, color: "white" }} />
                      <p>{file.name}</p>
                    </div>
                  ))}
                </div>
                {selectedFiles.length == 0 && (
                  <button className="folder_next_disable" disable>
                    Next
                  </button>
                )}
                {selectedFiles.length === 1 && (
                  <button className="folder_next" onClick={handleNextClick}>
                    Next
                  </button>
                )}
              </>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
export default ExcelSelector;
