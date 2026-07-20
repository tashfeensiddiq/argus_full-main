import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import Dropzone from "react-dropzone";
import React, { useState, useRef } from "react";
import { StylesContext } from "@material-ui/styles";

/* const fName = document.getElementById('1').value
const fDesc = document.getElementById('2').value */

function ModalAddImage({ open, handleClose, handleSubmit, id }) {
  const [state, setState] = useState([]);
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
  const dropRef = useRef();

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const updateBorder = (dragState) => {
    if (dragState === "over") {
      dropRef.current.style.border = "2px solid #000";
    } else if (dragState === "leave") {
      dropRef.current.style.border = "2px dashed #e9ebeb";
    }
  };
  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
  };

  /* const [state, setState] = React.useState({
    title: "",
    description: ""
  }); */

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Add Images to Folder"}
        </DialogTitle>
        <DialogContent>
          <div>
            <TextField
              id="iTitle"
              label="Enter Image Title"
              variant="filled"
              defaultValue={state.title}
              name="title"
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleChange(event);
              }}
            />
          </div>
          <TextField
            id="iDesc"
            label="Enter Image Description"
            variant="filled"
            defaultValue={state.description}
            name="description"
            onChange={(event) => {
              const value = event.currentTarget.value;
              handleChange(event);
            }}
          />
          {
            <div className="upload-section">
              <Dropzone
                onDrop={onDrop}
                onDragEnter={() => updateBorder("over")}
                onDragLeave={() => updateBorder("leave")}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps({ className: "drop-zone" })}
                    ref={dropRef}
                    style={{
                      border: "solid",
                      padding: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <input {...getInputProps()} />

                    <b>
                      {" "}
                      <p alignItem="Center">
                        Drag and drop a file OR click here to select a file
                      </p>
                    </b>

                    {file && (
                      <div>
                        <strong>Selected file:</strong> {file.name}
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>

              {/* { previewSrc ? (
            isPreviewAvailable ? (
              <div className="image-preview" alignItem="Center">
                <img
                  className="preview-image"
                  src={previewSrc}
                  alt="Preview"
                  width="600"
                  height="600"
                />
              </div>
            ) : (
              <div className="preview-message">
                <p>No preview available for this file</p>
              </div>
            )
          ) : (
            <div className="preview-message">
              <p style={{ color: "white" }}>
                {" "}
                Image preview will be shown here after selection
              </p>
            </div>
          )} */}
            </div>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleSubmit(state)} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export { ModalAddImage };

/* import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export function ModalFolder({open}) {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="standard-basic" label="Standard" variant="standard" placeholder="Enter Folder Name Here"/>
    </Box>
  );
} */
