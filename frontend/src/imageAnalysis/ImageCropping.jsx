import React, { useContext, useRef, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";

export default function ImageCropping({ inputImage, id }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [oldX, setOldX] = useState("");
  const [oldY, setOldY] = useState("");
  const [points, setPoints] = useState([]);
  const [cropImg, setCropImg] = useState("");
  const [changed, setChanged] = useState(false);
  const [cropping, setCropping] = useState(true);
  const [imageId, setImageId] = useState("");
  const maxWidth = 2000;
  const maxHeight = 550;

  useEffect(() => {
    const img = new Image();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (id) {
      setImageId(id);
    }

    img.onload = () => {
      const [imgWidth, imgHeight] = setDimension(img);

      canvas.width = imgWidth;
      canvas.height = imgHeight;
      canvas.style.width = "" + imgWidth + "px";
      canvas.style.height = "" + imgHeight + "px";

      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      context.lineCap = "round";
      context.strokeStyle = "red";
      context.lineWidth = 1;
      contextRef.current = context;
      setCropImg(canvas.toDataURL());
    };

    img.src = inputImage;
  }, []);

  const setDimension = (img) => {
    let height = img.height;
    let width = img.width;
    let multiplier = 1;

    if (height > maxHeight) {
      multiplier = height / maxHeight;
    }
    if (width > maxWidth) {
      multiplier =
        multiplier > width / maxWidth ? multiplier : width / maxWidth;
    }

    return [width / multiplier, height / multiplier];
  };

  const startdrawing = ({ nativeEvent }) => {
    if (cropping) {
      nativeEvent.preventDefault();
      const { offsetX, offsetY } = nativeEvent;
      let newPoint = { offsetX, offsetY };

      contextRef.current.beginPath();
      contextRef.current.moveTo(oldX, oldY);

      if (oldX != "") {
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
      }

      setOldX(offsetX);
      setOldY(offsetY);

      setPoints((prevState) => [...prevState, newPoint]);
    }
  };

  const cropimage = () => {
    if (cropping) {
      const image = document.getElementById("source");

      let tempCanvas = document.createElement("canvas");
      let tctx = tempCanvas.getContext("2d");

      tempCanvas.width = canvasRef.current.width;
      tempCanvas.height = canvasRef.current.height;
      tctx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);

      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      contextRef.current.beginPath();

      points.forEach((point, index) => {
        if (index === 0) {
          contextRef.current.moveTo(point.offsetX, point.offsetY);
        } else {
          contextRef.current.lineTo(point.offsetX, point.offsetY);
        }
      });

      contextRef.current.fillStyle = contextRef.current.createPattern(
        tempCanvas,
        "repeat"
      );
      contextRef.current.fill();

      setCropping(false);
      setChanged(true);
    }
  };

  const resetImage = () => {
    const image = new Image();
    image.src = inputImage;
    image.onload = () => {
      contextRef.current.drawImage(
        image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    };

    contextRef.current.beginPath();

    setOldX("");
    setOldY("");
    setPoints([]);
    setChanged(false);
    setCropping(true);
  };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={5}
    >
      <Grid item xs={6} direction="row" justify="center" alignItems="center">
        <canvas
          onMouseDown={startdrawing}
          style={{ border: "1px solid black" }}
          ref={canvasRef}
        >
          <img id="source" src={inputImage} />
        </canvas>
      </Grid>
      <Grid container item xs={12} justify="space-evenly">
        <Grid item>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            onClick={resetImage}
            variant="contained"
            color="#59d959"
            component="span"
            border="ridge"
          >
            reset
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={cropimage}
            variant="contained"
            color="#59d959"
            component="span"
            border="ridge"
          >
            Select
          </Button>
        </Grid>

        <Grid item>
          {changed ? (
            <Link
              to={
                imageId
                  ? {
                      pathname: "/imageResult",
                      data: {
                        img: cropImg,
                        points: points,
                      },
                      id: imageId,
                    }
                  : {
                      pathname: "/imageResult",
                      data: {
                        img: cropImg,
                        points: points,
                      },
                    }
              }
            >
              <Button
                variant="contained"
                color="#59d959"
                component="span"
                border="ridge"
              >
                {" "}
                Analyze{" "}
              </Button>
            </Link>
          ) : (
            <Button
              variant="contained"
              color="#59d959"
              component="span"
              border="ridge"
              disabled
            >
              {" "}
              Analyze{" "}
            </Button>
          )}
        </Grid>
      </Grid>

      <iframe
        width="510"
        height="285"
        src="https://www.youtube.com/embed/iwGnszgjQd0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </Grid>
  );
}
