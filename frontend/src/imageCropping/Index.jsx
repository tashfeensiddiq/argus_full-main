//Button with cropping with button!!!
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function ImageCropping(props) {
  const canvasRef = useRef(null);
  const [isCropping, setIsCropping] = useState(false);
  const [startCoord, setStartCoord] = useState({ x: 0, y: 0 });
  const [endCoord, setEndCoord] = useState({ x: 0, y: 0 });
  const [imageFinalAddress, setImageFinalAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    function reposition(event) {
      if (isCropping) {
        setEndCoord({
          x: event.clientX - canvasRect.left,
          y: event.clientY - canvasRect.top,
        });
      }
    }

    function start(event) {
      setIsCropping(true);
      setStartCoord({
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top,
      });
    }

    function stop() {
      setIsCropping(false);
    }

    function draw() {
      if (!isCropping) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.rect(
        startCoord.x,
        startCoord.y,
        endCoord.x - startCoord.x,
        endCoord.y - startCoord.y
      );
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mousemove", reposition);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mousemove", reposition);
      canvas.removeEventListener("mousemove", draw);
    };
  }, [isCropping, startCoord, endCoord, imageFinalAddress]);

  async function handleSaveCroppedImage(top, left, bottom, right, image) {
    setLoading(true);
    const rect = [top, left, bottom, right];
    const response = await axios.post(
      "http://localhost:4000/images/imageBgCropping",
      {
        rect,
        image,
      },
      {
        responseType: "json",
      }
    );
    const timestamp = new Date().getTime(); // generate a unique timestamp
    setImageFinalAddress(`${response.data.finalOutput}?t=${timestamp}`);
    // setImageFinalAddress(response.data.finalOutput);
    setLoading(false);
  }
  const img = new Image();
  img.src = props.location.state.image;

  return (
    <div style={{ position: "relative" }}>
      <img src={props.location.state.image} alt="My Image" />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: img.offsetTop,
          left: img.offsetLeft,
          zIndex: 1,
        }}
        width={img.width}
        height={img.height}
      />
      <div>
        <button
          onClick={() =>
            handleSaveCroppedImage(
              startCoord.y,
              startCoord.x,
              endCoord.y,
              endCoord.x,
              props.location.state.image
            )
          }
        >
          Cropped Image Analyze
        </button>
      </div>
      {imageFinalAddress ? (
        <>
          <img src={imageFinalAddress} alt="final Output" />
          <Link
            to={{
              pathname: "/imageDrawing",
              state: { image: props.location.state.image },
            }}
          >
            <button>Go to Drawing</button>
          </Link>
        </>
      ) : null}
      {loading && <div>Loading...</div>}
    </div>
  );
}

export { ImageCropping };
