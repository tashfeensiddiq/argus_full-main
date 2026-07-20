import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FolderIcon from "@material-ui/icons/Folder";
import FileIcon from "@material-ui/icons/InsertDriveFile"; // Importing File Icon
import Modal from "@material-ui/core/Modal"; // Importing Modal
const type = "folder";
import { useHistory, NavLink, Link } from "react-router-dom";
import axios from "axios";
import * as AiIcons from "react-icons/ai";
import "./design.css";

const Folder = ({
  id,
  arrayIndex,
  left,
  top,
  hideSourceOnDrag,
  name,
  files,
  uploadFile,
  updateFolderName,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const history = useHistory();
  
  const fileInput = React.createRef();
  const folderRef = React.useRef(null);
  const [checked, setChecked] = React.useState(false);
  const [open, setOpen] = useState(false); // State to handle modal visibility
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editing, setEditing] = useState(false); // State to determine editing mode
  const [newName, setNewName] = useState(name); // Temporary state for name changes

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        folderRef.current &&
        !folderRef.current.contains(event.target) &&
        editing
      ) {
        setEditing(false); // Exit edit mode when clicked outside
      }
    }

    // Add when mounted
    document.addEventListener("mousedown", handleClickOutside);

    // Return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editing]);

  const handleFileSelection = (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles((prevSelectedFiles) =>
        prevSelectedFiles.filter((f) => f !== file)
      );
    } else {
      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, file]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileInputClick = () => {
    fileInput.current.click();
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array

    files.forEach((file) => {
      uploadFile(id, file);
    });
  };
  const handleEdit = () => {
    setEditing(true);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSaveName = () => {
    setEditing(false);
    updateFolderName(id, arrayIndex, newName); // Call the prop method to update the name
  };

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }

  return (
    <div className="folderes_layout" ref={folderRef} onDoubleClick={handleOpen}>
      <div className="folderes_layout" ref={drag} onDoubleClick={handleOpen}>
        <FolderIcon className="folder" />
        <div>{name}</div>
        <div>
          {editing ? (
            <div className="save_button_layout">
              <input value={newName} onChange={handleNameChange} />
              <button className="save_button" onClick={handleSaveName}><AiIcons.AiOutlineCheck /></button>
            </div>
          ) : (
            <>
              {/* {name} */}
              {/* <button className="edit_button" onClick={handleEdit}>Edit</button> */}
              <input
          type="checkbox"
          checked={checked}
          onChange={handleEdit}
        />
            </>
          )}
        </div>

        {/* Modal to display the files and handle file upload */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className="outer_folder_layout">
            <h2 className="folder_header">Files in {name}</h2>
            <div className="inside_folder_layout">
              {files.map((file, index) => (
                <div
                  key={index}
                  onClick={() => handleFileSelection(file)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedFiles.includes(file)
                      ? "grey" // Indicate selection with a different background
                      : "transparent",
                  }}
                >
                  <FileIcon style={{ fontSize: 40, color: "white" }} />
                  <p>{file.name}</p>
                </div>
              ))}
              {/* Display the Next button only when there are selected files */}
              {/* {selectedFiles.length > 0 && (
            <button onClick={handleNextClick}>Next</button>
          )} */}
              <input
                type="file"
                name="file"
                ref={fileInput}
                style={{ display: "none" }}
                onChange={handleFileUpload}
                multiple // Add this
              />
            </div>

            <button className="uplopad_button" onClick={handleFileInputClick}>
              Upload File
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

const Target = ({ moveFolder }) => {
  const [, drop] = useDrop({
    accept: type,
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      let left = Math.round(item.left + delta.x);
      let top = Math.round(item.top + delta.y);
      moveFolder(item.id, left, top);
    },
  });

  return <div ref={drop} />;
};

const Container = () => {
  const [folders, setFolders] = useState({});
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const fetchFolders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/folders");
      setFolders(response.data);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };
  useEffect(() => {
    // Fetch folders on mount

    fetchFolders();
  }, []);

  const updateFolderName = async (id, arrayIndex, newName) => {
    try {
      // Make API call to update folder name
      const response = await axios.put(
        `http://localhost:4000/folders/${id}/rename`,
        { name: newName }
      );

      if (response.status === 200) {
        setFolders((prevFolders) => {
          const updatedFolders = { ...prevFolders };
          if (updatedFolders[arrayIndex]) {
            updatedFolders[arrayIndex].name = newName;
          } else {
            console.warn(`Folder with ID ${id} not found`);
          }
          return updatedFolders;
        });
      } else {
        console.error("Failed to rename the folder on the server.");
      }
    } catch (error) {
      console.error("Error renaming the folder:", error);
    }
  };

  const addNewFolder = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/folders", {
        name: newFolderName,
      });
      const newFolder = response.data;
      setFolders((prevFolders) => ({
        ...prevFolders,
        [newFolder._id]: newFolder,
      }));
      setNewFolderName("");
      setCreatingFolder(false);
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };
  const uploadFile = async (folderId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `http://localhost:4000/folders/${folderId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.message) {
        fetchFolders(); // Refresh folder data from backend after uploading
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
    }
  };

  const moveFolder = async (id, left, top) => {
    try {
      const response = await axios.put(`http://localhost:4000/folders/${id}`, {
        left: left,
        top: top,
      });
      if (response.status === 200) {
        setFolders((prevState) => {
          return { ...prevState, [id]: { ...prevState[id], left, top } };
        });
      } else {
        console.error("Failed to update folder position.");
      }
    } catch (error) {
      console.error("Failed to update folder position:", error);
    }
  };

  return (
    <div className="folder_container">
      <DndProvider backend={HTML5Backend}>
        {creatingFolder && (
          <form onSubmit={addNewFolder} className="create_folder_layout">
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              required
            />
            <button className="new_folder submit" type="submit">
              Create
            </button>
            <button
              className="new_folder button"
              type="button"
              onClick={() => setCreatingFolder(false)}
            >
              Cancel
            </button>
          </form>
        )}
        {!creatingFolder && (
          <button
            className="new_folder"
            onClick={() => setCreatingFolder(true)}
          >
            New Folder
          </button>
        )}
        <Target moveFolder={moveFolder} />
        {Object.keys(folders).map((id) => {
          const { left, top, name, files, _id } = folders[id];

          return (
            <Folder
              key={name}
              arrayIndex={id}
              id={_id}
              left={left}
              top={top}
              hideSourceOnDrag={false}
              name={name}
              files={files}
              uploadFile={uploadFile}
              updateFolderName={updateFolderName}
            />
          );
        })}
      </DndProvider>
    </div>
  );
};
export default Container;
