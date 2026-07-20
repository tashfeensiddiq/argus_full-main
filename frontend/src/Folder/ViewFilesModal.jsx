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

function ViewFilesModal({ open, handleClose, handleSubmit, handleDelete, id, folderName, imageList }) {
  
  const [selectedFileList, setSelectedFileList] = useState([]);
  
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

  const resetFileSelections = () => {
    setSelectedFileList([])
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onRendered={resetFileSelections}
      >
        <DialogTitle id="alert-dialog-title">
          {"Images in Folder:"}
        </DialogTitle>
        <DialogContent>
            <table>
                <thead>
                    <th>Image Name</th>
                    <th>Image Description</th>
                    <th>Select File</th>
                </thead>
                <tbody>
                {imageList.length > 0 ? (
                imageList.map(
                  ({
                    _id,
                    title,
                    description,
                  }) => (
                    <tr key={_id}>
                      <td className="image-title">{title}</td>
                      <td className="image-description">{description}</td>
                      <td className="chart-selection">
                        <input
                          type="checkbox"
                          name="image-selection"
                          value={[
                            title
                          ]}
                          onChange={event => {
                            const fileTitle = event.target.value;
                            console.log(selectedFileList);
                            if(event.target.checked){
                              selectedFileList.push(fileTitle);
                            }
                            else {
                              for(var i = 0; i < selectedFileList.length; i++) {
                                if(selectedFileList[i] == fileTitle) {
                                  selectedFileList.splice(i,1)
                                }
                              }
                              setSelectedFileList(selectedFileList);
                            }
                            console.log(folderName)
                          }}
                        />
                      </td>
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
          <Button onClick={() => handleDelete(selectedFileList, folderName)} autofocus>
            Delete Selected Images
          </Button>
          <Button onClick={() => handleSubmit(state)} autoFocus>
            Submit Selected Images
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export { ViewFilesModal };

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