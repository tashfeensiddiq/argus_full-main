import * as React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { StylesContext } from "@material-ui/styles";

function FileDeleteModal({ open, handleClose, handleDelete, id, imageList }) {
  
  const setTitleState = (value) => {
    state.title = value;
  };

  const setDescState = (value) => {
    state.description = value;
  };
  
  const [state, setState] = React.useState({
    title: "",
    description: ""
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are You Sure You Wish to Delete the Following Files?:"}
        </DialogTitle>
        <DialogContent>
            <table>
                <thead>
                    <th>Image Name</th>
                    <th>Image Description</th>
                    <th>Folder Name</th>
                </thead>
                <tbody>
                {imageList.length > 0 ? (
                imageList.map(
                  ({
                    _id,
                    title,
                    description,
                    folderTitle
                  }) => (
                    <tr key={_id}>
                      <td className="image-title">{title}</td>
                      <td className="image-description">{description}</td>
                      <td className="folder-name">{folderTitle}</td>
                    </tr>
                          )
                        )
                    ) : (
                        <tr>
                          <td colSpan={3} style={{ fontWeight: "300" }}>
                            No files found. Please add some.
                          </td>
                        </tr>
                      )}
                    </tbody>

            </table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>
            Confirm
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export { FileDeleteModal };
