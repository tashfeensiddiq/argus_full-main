import React, { useState, useEffect } from "react";
import download from "downloadjs";
import { accountService } from "@/_services";

import axios from "axios";
import ImageCropping from "../imageAnalysis/ImageCropping";

import { Button } from "@material-ui/core";
import { Modal } from "@/_components";
import { ModalFolder } from "./ModalFolder";
import { ModalAddImage } from "./ModalAddImage";
import { ViewFilesModal } from "./ViewFilesModal";
import { EditDetailsModal } from "./EditDetailsModal";
import { FileDeleteModal } from "./FileDeleteModal";

const Folders = () => {
  const [folderList, setFolderList] = useState([]);
  const [folderImageList, setFolderImageList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShow] = useState(false);
  const [showImageModal, setImageModalShow] = useState(false);

  const [open, setOpen] = React.useState(false);
  const [checkedFolder, setCheckedFolder] = useState("");
  const [folderName, setFolderName] = useState("");
  const [folderDescription, setFolderDescription] = useState("");
  const [showViewFilesModal, setShowViewFilesModal] = useState(false);
  const [imagesInFolder, setImagesInFolder] = useState([]);
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [folderEditTitle, setFolderEditTitle] = useState("");
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [showFileDeleteModal, setShowFileDeleteModal] = useState(false);
  const [files, setFiles] = useState([]);

  const user = accountService.userValue;

  const handleShowEditDetailsModal = (title) => {
    setFolderEditTitle(title);
    setFolderName(title);
    setFolderDescription(folderName.description);
    setShowEditDetailsModal(true);
  };

  const handleEditDetailsModalCancel = () => {
    setFolderEditTitle();
    setShowEditDetailsModal(false);
  };

  const handleEditDetailsModalSubmit = async (event) => {
    for (var i = 0; i < folderImageList.length; i++) {
      console.log(folderImageList[i].folderTitle);
      if (folderImageList[i].folderTitle == folderEditTitle) {
        folderImageList[i].folderTitle = event.title;
      }
    }
    for (var i = 0; i < folderList.length; i++) {
      if (folderList[i].title == folderEditTitle) {
        folderList[i].title = event.title;
        folderList[i].description = event.description;
      }
    }
    setFolderList(folderList);
    setFolderEditTitle();
    setShowEditDetailsModal(false);
  };

  const handleShowViewFilesModal = (title) => {
    for (var i = 0; i < folderImageList.length; i++) {
      if (folderImageList[i].folderTitle == title) {
        imagesInFolder.push({
          title: folderImageList[i].title,
          description: folderImageList[i].description,
        });
      }
    }
    setFolderName(title);
    //setImagesInFolder(imagesInFolder)
    setShowViewFilesModal(true);
  };

  const handleViewFilesModalClose = () => {
    setShowViewFilesModal(false);
    setImagesInFolder([]);
  };

  const handleDeleteFile = async (event, folder) => {
    for (var i = 0; i < event.length; i++) {
      for (var j = 0; j < folderImageList.length; j++) {
        if (
          event[i] == folderImageList[j].title &&
          folder == folderImageList[j].folderTitle
        ) {
          filesToDelete.push(folderImageList[j]);
        }
      }
    }
    setShowViewFilesModal(false);
    setShowFileDeleteModal(true);
  };

  const handleFileDeleteModalClose = () => {
    setFilesToDelete([]);
    setImagesInFolder([]);
    setShowFileDeleteModal(false);
  };

  const handleFileDeleteModalConfirm = () => {
    for (var i = 0; i < filesToDelete.length; i++) {
      for (var j = 0; j < folderImageList.length; j++) {
        if (
          filesToDelete[i].title == folderImageList[j].title &&
          filesToDelete[i].description == folderImageList[j].description &&
          filesToDelete[i].folderTitle == folderImageList[j].folderTitle
        ) {
          folderImageList.splice(j, 1);
        }
      }
    }
    setFolderImageList(folderImageList);
    setImagesInFolder([]);
    setFilesToDelete([]);
    console.log(filesToDelete);
    setShowFileDeleteModal(false);
  };

  const handleClickOpen = (title) => {
    setOpen(true);
  };

  const handleShowModal = () => {
    setShow(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleModalClose = () => {
    setShow(false);
  };

  const handleModalSubmit = async (event) => {
    try {
      await axios.post("http://localhost:4000/folders/upload", {
        title: event.title,
        description: event.description,
        userId: user.id,
      });
      setShow(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowImageModal = () => {
    setImageModalShow(true);
  };

  const handleCloseImageModal = () => {
    setImageModalShow(false);
  };

  const handleImageModalSubmit = async (e) => {
    e.preventDefault();
    console.log("hi");
    const formData = new FormData();
    Object.values(files).forEach((file) => {
      formData.append("images", file);
    });
    formData.append("userId", user.id);
    formData.append("folderId", checkedFolder);

    try {
      const res = await axios.post(
        "http://localhost:4000/folders/imagesUpload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
    } catch (err) {
      if (err.response.status === 500) {
        console.log(err);
      } else {
        console.log(err.response.data.msg);
      }
    }
    window.location.reload();
  };

  const onChangeFolderSelection = (event) => {
    if (checkedFolder === event.target.id) {
      setCheckedFolder("");
    } else {
      setCheckedFolder(event.target.id);
    }
  };
  const onChangeFiles = (e) => {
    console.log(e.target.files);
    setFiles(e.target.files);
  };

  useEffect(() => {
    const getFolderList = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/folders/getFolders/${user.id}`
        );
        setErrorMsg("");

        setFolderList(data);

        console.log(data);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };
    getFolderList();
  }, []);

  const deleteFolder = async (id) => {
    console.log(id);
    try {
      await axios.delete(`http://localhost:4000/folders/folderDelete`, {
        data: {
          folderId: id,
          userId: user.id,
        },
      });
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg("Error while deleting file. Try again later");
      }
    }
  };

  return (
    <>
      <div className="folders-container">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <table className="folders-table">
          <thead>
            <tr>
              <th>Folder Title</th>
              <th>Folder Description</th>
              <th>View Folder Files</th>
              <th>Edit Folder Details</th>
              <th>Select Folder</th>
              <th>Delete Folder</th>
            </tr>
          </thead>
          <tbody>
            {folderList.length > 0 ? (
              folderList.map(({ _id, title, description }) => (
                <tr key={_id}>
                  <td className="folder-title">{title}</td>
                  <td className="folder-description">{description}</td>
                  <td>
                    <a onClick={() => handleShowViewFilesModal(title)}>
                      View Files
                    </a>
                  </td>
                  <td>
                    <a onClick={() => handleShowEditDetailsModal(title)}>
                      Edit
                    </a>
                  </td>
                  <td className="chart-selection">
                    <input
                      type="checkbox"
                      checked={checkedFolder === _id}
                      name="folder-selection"
                      value={title}
                      id={_id}
                      onChange={onChangeFolderSelection}
                      // onchange?
                    />
                  </td>
                  <td className="data-delete">
                    <a onClick={() => handleClickOpen()}>Delete folder</a>
                  </td>

                  <Modal
                    open={open}
                    handleClose={handleClose}
                    handleSubmit={deleteFolder}
                    id={_id}
                  />
                  <ModalFolder
                    open={showModal}
                    handleClose={handleModalClose}
                    handleSubmit={handleModalSubmit}
                    id={_id}
                  />
                  <ModalAddImage
                    open={showImageModal}
                    handleClose={handleCloseImageModal}
                    handleSubmit={handleImageModalSubmit}
                    id={_id}
                  />
                  <ViewFilesModal
                    open={showViewFilesModal}
                    handleClose={handleViewFilesModalClose}
                    handleSubmit={handleViewFilesModalClose} // change to send to backend
                    handleDelete={handleDeleteFile}
                    id={_id}
                    folderName={folderName}
                    imageList={imagesInFolder}
                  />
                  <EditDetailsModal
                    open={showEditDetailsModal}
                    handleClose={handleEditDetailsModalCancel}
                    handleSubmit={handleEditDetailsModalSubmit}
                    id={_id}
                    folderName={folderName}
                    folderDescription={folderDescription}
                  />
                  <FileDeleteModal
                    open={showFileDeleteModal}
                    handleClose={handleFileDeleteModalClose}
                    id={_id}
                    imageList={filesToDelete}
                    handleDelete={handleFileDeleteModalConfirm}
                  />
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ fontWeight: "300" }}>
                  No files found. Please add some.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div style={{ "text-align": "center" }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            onClick={() => handleShowModal()}
            variant="contained"
            size="small"
            color="#59d959"
            component="span"
            border="ridge"
          >
            New Folder
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <form onSubmit={handleImageModalSubmit}>
            <Button
              variant="contained"
              size="small"
              color="#59d959"
              component="span"
              border="ridge"
            >
              <input
                type="file"
                id="file"
                name="uploadImages"
                multiple
                onChange={onChangeFiles}
              />
              <input type="submit" value="Run" />
              Add Images to Selected Folder
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export { Folders };
