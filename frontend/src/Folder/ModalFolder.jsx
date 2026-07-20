import * as React from "react";

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

/* const fName = document.getElementById('1').value
const fDesc = document.getElementById('2').value */

/* const handleChange = (event) => {
  setState({
    ...state,
    [event.target.name]: event.target.value,
  });
}; */

/* const state = {
    title: "",
    description: ""
  }; */

function ModalFolder({ open, handleClose, handleSubmit }) {
  const state = {
    title: "",
    description: "",
  };

  const setTitleState = (value) => {
    state.title = value;
  };

  const setDescState = (value) => {
    state.description = value;
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
        <DialogTitle id="alert-dialog-title">{"New Folder"}</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              id="fName"
              label="Enter Folder Name"
              variant="filled"
              defaultValue={state.title}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setTitleState(value);
              }}
            />
          </div>
          <TextField
            id="fDesc"
            label="Enter Folder Description"
            variant="filled"
            defaultValue={state.description}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setDescState(value);
            }}
          />
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
export { ModalFolder };

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
