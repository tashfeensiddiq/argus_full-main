import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { Grid, Typography } from "@material-ui/core";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

// import LoaderGif from "./loadinggif.gif";

// import videosam from "./loading.mp4";

function ImageResult(props) {
  const [source, setSource] = useState("");
  const [corrosion, setCorrosion] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [outputImage, setOutputImage] = useState("");
  const [totalPixels, setTotalPixels] = useState("");
  // const [totalCorosion, setTotalCorosion] = useState("");
  const [edges, setEdges] = useState("");
  const [imageId, setImageId] = useState("");

  const styleObj = {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    paddingTop: "100px",
  };

  useEffect(() => {
    if (props.location) {
      let base64Img = props.location.data.img.replace(
        /^data:image\/png;base64,/,
        ""
      );

      let points = props.location.data.points;
      if (props.location.id) {
        setImageId(props.location.id);
      }

      axios
        .post(
          "http://localhost:4000/images/corrosion",
          // "http://20.69.146.171:4000/images/corrosion",

          {
            data: {
              img: base64Img,
              points: points,
              apiKey: "xyxF9&2G9R@AkFQ-",
              // apiKey: "sjkd#xFkndi13d",
            },
          }
        )
        .then((res) => {
          let data = "data:image/png;base64," + res.data.result.img;
          let output_img =
            "data:image/png;base64," + res.data.result.output_img;
          setSource(data);
          setCorrosion(res.data.result.corrsion);
          setEdges(res.data.result.edges);

          setTotalPixels(res.data.result.total_pixels);
          setOutputImage(output_img);

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
  const saveCorrosionToFolder = async (id, base64, percentage) => {
    try {
      const result = await axios.put(
        `http://localhost:4000/images/corrosionImageSave`,
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
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Grid item>
            <Typography style={{ styleObj }} variant="h5">
              <p class="double">
                <b> Total corrosion coverage on the asset is {corrosion} %</b>
              </p>
            </Typography>
          </Grid>
          <Grid container direction="row" justify="space-evenly">
            <Grid item>
              <Button
                variant="contained"
                margin-right="25%"
                size="large"
                color="primary"
                container
                direction="column"
                justify="right"
                alignItems="right"
                onClick={Download}
              >
                Download
              </Button>
            </Grid>
            <Grid item>
              <Link
                to={
                  imageId
                    ? {
                        pathname: "/imageComparison",
                        data: {
                          img: outputImage,
                          total_pixels: totalPixels,
                          edges: edges,
                          total_corrosion: corrosion,
                        },
                        id: imageId,
                      }
                    : {
                        pathname: "/imageComparison",
                        data: {
                          img: outputImage,
                          total_pixels: totalPixels,
                          edges: edges,
                          total_corrosion: corrosion,
                        },
                      }
                }
              >
                <Button
                  variant="contained"
                  margin-right="25%"
                  size="large"
                  color="#59d959"
                  container
                  component="span"
                  direction="column"
                  justify="right"
                  alignItems="right"
                  border="ridge"
                >
                  Severe corrosion analysis
                </Button>
              </Link>
            </Grid>
            {imageId ? (
              <Grid item>
                <Button
                  variant="contained"
                  margin-right="25%"
                  size="large"
                  color="#59d959"
                  container
                  component="span"
                  direction="column"
                  justify="right"
                  alignItems="right"
                  border="ridge"
                  onClick={() =>
                    saveCorrosionToFolder(imageId, source, corrosion)
                  }
                >
                  Save Corrosion Image To Folder
                </Button>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Alert variant="success">
            <Alert.Heading>
              <b>
                What is the relevance for assessing percentage of corrosion
                coverage and how is it calculated?
              </b>
            </Alert.Heading>
            <p>
              Assessment of percentage of corrosion coverage helps the user to
              understand risks posed by corrosion to the asset(s). This can
              further assist to optimally strategize predictive
              integrity-maintenance practices for the asset(s).
            </p>
            <p>
              During the analysis, Argus measures the area of corrosion that was
              captured in the input image. The measured area of corrosion when
              mathematically compared against the area of the image that was
              selected to be analyzed, yields the percentage of corrosion
              present in the selected part of the image.
            </p>
            <hr />
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
export { ImageResult };
