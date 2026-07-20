import Alert from "react-bootstrap/Alert";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { Grid, Typography } from "@material-ui/core";
import ImageCropping from "./ImageCropping.jsx";
import BarChartRoundedIcon from "@material-ui/icons/BarChartRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(4),
    },
    justifyContent: "center",
  },
  input: {
    display: "none",
  },
  title: {
    marginBottom: "20px",
    fontSize: "20px",
  },
}));

function ImageAnalysis() {
  const classes = useStyles();
  const [loaded, setloaded] = React.useState(false);
  const [imageSrc, setImage] = React.useState("");

  const handleUploadClick = (e) => {
    let src = URL.createObjectURL(e.target.files[0]);
    setImage(src);
    setloaded(true);
  };

  return (
    <div justify-content="space-around">
      <label style={{ display: "block" }} justify-content="space-around">
        {loaded ? (
          <ImageCropping inputImage={imageSrc} />
        ) : (
          <Grid
            container
            direction="column"
            justify-content="center"
            alignItems="center"
          >
            {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
            <Grid item xs={3}>
              <b style={{ color: "white" }} className={classes.title}>
                {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  */}
                Please upload the image below:
              </b>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.root}>
                <input
                  accept="image/*"
                  className={classes.input}
                  id="icon-button-file"
                  type="button"
                  onChange={handleUploadClick}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  type="file"
                  onChange={handleUploadClick}
                />
                <label htmlFor="contained-button-file">

                  
                  <Button
                    variant="contained"
                    size="large"
                    color="#59d959"
                    component="span"
                    border="ridge"
                  >
                    Upload
                  </Button>



                </label>
              </div>

              <div></div>
            </Grid>
          </Grid>
        )}
      </label>
      <Alert variant="success" alignItems="center">
        <Alert.Heading>
          <b>Pro tips:</b>
        </Alert.Heading>

        <p>
          1. Only the following file formats are supported: .jpg, .png, .tif.{" "}
        </p>
        <p>
          2. Single instance multi-file uploading feature is not available in
          this version.
        </p>
        <p>
          3. For best results, please avoid using blurry/fuzzy images in
          analysis.
        </p>
        <p>
          4.‘Drag and Drop’ functionality for image uploading is not available
          yet.
        </p>
        <p>
          5. If the uploaded picture needs to be changed, please navigate back
          to the top bar menu, and click on the “Analysis” button again.
        </p>

        <hr />
      </Alert>
    </div>
  );
}

export { ImageAnalysis };
