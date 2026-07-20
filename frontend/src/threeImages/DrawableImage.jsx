import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const DrawableTable = ({ src, onUpdate, updatedImage }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [blackPoints, setBlackPoints] = useState([]);
  const [whitePoints, setWhitePoints] = useState([]);
  const [ctx, setCtx] = useState(null);
  const [color, setColor] = useState("black");
  const [showSuccessButton, setShowSuccessButton] = useState(true); // added state to track success button visibility
  // const imgSrc = updatedImage || src;
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setCtx(context);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
    };
  }, [src]);

  function reposition(event) {
    setCoord({
      x: event.clientX - canvasRef.current.offsetLeft,
      y: event.clientY - canvasRef.current.offsetTop,
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
      setBlackPoints((prevBlackPoints) => [
        ...prevBlackPoints,
        { x: coord.x, y: coord.y },
      ]);
    } else if (color === "white") {
      setWhitePoints((prevWhitePoints) => [
        ...prevWhitePoints,
        { x: coord.x, y: coord.y },
      ]);
    }
  }

  const handleBgRemove = async () => {
    const data = {
      blackPoints,
      whitePoints,
      image: src,
      flag: 0,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/images/imageBgRemoveDrawing",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onUpdate(res.data.finalOutput);
      window.location.reload(true);

      setShowSuccessButton(true); // set success button visibility to true

      // onUpdate(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleReset = async () => {
    const data = {
      blackPoints,
      whitePoints,
      image: src,
      flag: 1,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/images/imageBgRemoveDrawing",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onUpdate(res.data.finalOutput);
      window.location.reload(true);

      setShowSuccessButton(true); // set success button visibility to true

      // onUpdate(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleClear = async () => {
    const data = {
      blackPoints,
      whitePoints,
      image: src,
      flag: 2,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/images/imageBgRemoveDrawing",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onUpdate(res.data.finalOutput);
      window.location.reload(true);

      setShowSuccessButton(true); // set success button visibility to true

      // onUpdate(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSuccess = async () => {
    const data = {
      image: src,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/images/afterbg_calculation",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload(true);
      console.log(res.data);
      // onUpdate(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseOut={stop}
      />
      {showSuccessButton && (
        <button onClick={handleSuccess}>Success Button</button>
      )}
      <div>
        <button onClick={() => setColor("black")}>Black</button>
        <button onClick={() => setColor("white")}>White</button>
        <button onClick={handleBgRemove}>Draw</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleClear}>Clear</button>
      </div>
    </>
  );
};

export default DrawableTable;
