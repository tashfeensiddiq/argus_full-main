///two color with button
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

function ImageDrawing(props) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("black");
  const [blackPoints, setBlackPoints] = useState([]); // added state to store black points
  const [whitePoints, setWhitePoints] = useState([]); // added state to store white points
  const [imageFinalAddress, setImageFinalAddress] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    function reposition(event) {
      setCoord({
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top,
      });
    }

    function start(event) {
      setIsDrawing(true);
      reposition(event);
    }

    function stop() {
      setIsDrawing(false);
    }

    function draw(event) {
      if (!isDrawing) {
        return;
      }
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      ctx.moveTo(coord.x, coord.y);
      reposition(event);
      ctx.lineTo(coord.x, coord.y);

      ctx.stroke();

      if (color === "black") {
        // store black points in separate array
        setBlackPoints((prevBlackPoints) => [
          ...prevBlackPoints,
          { x: coord.x, y: coord.y },
        ]);
      } else if (color === "white") {
        // store white points in separate array
        setWhitePoints((prevWhitePoints) => [
          ...prevWhitePoints,
          { x: coord.x, y: coord.y },
        ]);
      }
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mousemove", draw);
    };
  }, [isDrawing, coord, color]);

  const handleSave = async () => {
    setLoading(true);
    // added handleSave function to send data to the server
    const response = await axios.post(
      "http://localhost:4000/images/imageBgRemoveDrawing",
      {
        blackPoints,
        whitePoints,
        image: props.location.state.image,
      },
      {
        responseType: "json",
      }
    );
    console.log(response.data.finalOutput);
    setImageFinalAddress(response.data.finalOutput);
    setLoading(false);
  };

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
        <button onClick={() => setColor("black")}>Black</button>
        <button onClick={() => setColor("white")}>White</button>
        <button onClick={() => handleSave()}>Save Cropped Image</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <img src={imageFinalAddress} alt="final Output" />
      )}
    </div>
  );
}
export { ImageDrawing };
