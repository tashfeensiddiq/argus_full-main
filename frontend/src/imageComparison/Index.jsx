import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import axios from "axios";
function ImageComparison(props) {
  const [source, setSource] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [corrosion, setCorrosion] = useState("");
  const [imageId, setImageId] = useState("");

  useEffect(() => {
    if (props.location) {
      let base64Img = props.location.data.img.replace(
        /^data:image\/png;base64,/,
        ""
      );
      if (props.location.id) {
        setImageId(props.location.id);
      }

      axios
        .post(
          // "https://argus-backend-abovewater.azurewebsites.net/api/users/upload",
          // "http://argus-backend.azurewebsites.net/api/users/upload",
          "http://localhost:4000/images/imageComparison",
          // "https://new-argus-back.azurewebsites.net/images/imageComparison",
          // "https://argus-topside-asset.azurewebsites.net/api/users/upload",

          {
            data: {
              img: base64Img,
              apiKey: "xyxF9&2G9R@AkFQ-",
              // apiKey: "sjkd#xFkndi13d",
              total_pixels: props.location.data.total_pixels,
              edges: props.location.data.edges,
              total_corrosion: props.location.data.total_corrosion,
            },
          }
        )
        .then((res) => {
          let data = "data:image/png;base64," + res.data.result.img;

          setSource(data);
          setCorrosion(res.data.result.corrsion);
          setLoaded(true);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const Download = () => {
    const img = new Image();
    img.src = source;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const a = document.createElement("a");
      a.download = "download.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
  };

  const saveSevereToFolder = async (id, base64, percentage) => {
    try {
      const result = await axios.put(
        `http://localhost:4000/images/severeImageSave`,
        { id, base64, percentage }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {loaded ? (
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <img id="source" src={source} width="1400px" />
          </Grid>

          <Grid item>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Typography variant="h5">
              <p class="double">
                <b> Severe corrosion coverage on the asset is {corrosion} %</b>
              </p>
            </Typography>
            <center>
              <Button
                variant="contained"
                margin-right="25%"
                size="large"
                color="#59d959"
                container
                direction="column"
                justify="right"
                component="span"
                border="ridge"
                alignItems="center"
                onClick={Download}
              >
                Download
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {imageId ? (
                <Button
                  variant="contained"
                  margin-right="25%"
                  size="large"
                  component="span"
                  color="#59d959"
                  border="ridge"
                  container
                  direction="column"
                  justify="right"
                  alignItems="right"
                  onClick={() => saveSevereToFolder(imageId, source, corrosion)}
                >
                  Save Corrosion Image To Folder
                </Button>
              ) : (
                <></>
              )}
            </center>
          </Grid>
          <Grid />
          <Alert variant="success" alignItems="center">
            <Alert.Heading>
              <b>Implication of severe corrosion analysis:</b>
            </Alert.Heading>

            <p>
              The intensity of corrosion warrants thorough evaluation, since an
              asset’s structural failure (like cracks, leaks etc.) can largely
              depend on the severity of corrosion occurring.{" "}
            </p>
            <p>
              Argus 1.21 is capable of detecting severe corrosion formations
              caused due to multifold accumulation of corrosion product(s) on
              the asset. This solution enables one to visualize the severity of
              corrosion in a spatially resolved manner with quantitative
              information for a given asset.
            </p>
          </Alert>
        </Grid>
      ) : (
        <Grid
          container
          justify="center"
          alignItems="center"
          text-align="center"
        >
          <h4>Please wait while Argus is processing your image </h4> &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp;
          <Spinner animation="border" />
        </Grid>
      )}
    </div>
  );
}

export { ImageComparison };
