// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import io from "socket.io-client";

// const ThreeImages = () => {
//   const [analysisComplete, setAnalysisComplete] = useState(false);
//   const location = useLocation();
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const [remainingTime, setRemainingTime] = useState("");

//   const buttonContainerStyle = {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: "20px",
//     flexDirection: "column",
//   };

//   const buttonStyle = {
//     padding: "10px 20px",
//     margin: "10px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     backgroundColor: "#007BFF",
//     color: "white",
//     fontWeight: "bold",
//   };
//   const activeButtonStyle = {
//     ...buttonStyle, // inherit all styles from buttonStyle
//     backgroundColor: "#0056b3", // slightly darker shade for active state
//   };

//   const processingButtonStyle = {
//     ...buttonStyle,
//     backgroundColor: "#d1d1d1", // gray out the button
//     cursor: "not-allowed", // show that it's not clickable
//   };

//   useEffect(() => {
//     const socket = io("http://localhost:4000", {
//       withCredentials: true,
//     });

//     socket.on("progress-update", (data) => {
//       // Ensure this event name matches with what's emitted from the backend
//       console.log(data);
//       setRemainingTime(data); // Update the remaining time in your state
//     });
//     return () => socket.disconnect();
//   }, []);

//   const onSubmit = async (e) => {
//     if (e) e.preventDefault();

//     if (!selectedOption) {
//       alert("Please select an option first."); // Notify the user to select an option
//       return;
//     }
//     try {
//       const formData = new FormData();
//       const blobData =
//         location.state?.uploadedFileData?.map((fileData) => fileData.data) ||
//         [];

//       blobData.forEach((blob, index) => {
//         const file = new File([blob], `image${index}.png`, {
//           type: "image/png",
//         });
//         formData.append("images", file);
//       });

//       formData.append("selectedOption", selectedOption);

//       const res = await axios.post(
//         `http://localhost:4000/images/autoAnalysis/${location.state.folderId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           responseType: "json",
//         }
//       );

//       // When we get a response from the backend, it means the analysis is complete.
//       setAnalysisComplete(true);

//       // If you need to store anything in local storage, you can still do it here.
//     } catch (err) {
//       if (err.response.status === 500) {
//         console.log(err);
//       } else {
//         console.log(err.response.data.msg);
//       }
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <div style={buttonContainerStyle}>
//         <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
//           <button
//             style={
//               selectedOption === "withDetection"
//                 ? activeButtonStyle
//                 : buttonStyle
//             }
//             onClick={() => setSelectedOption("withDetection")}
//           >
//             With automated asset part detection
//           </button>
//           <button
//             style={
//               selectedOption === "withoutDetection"
//                 ? activeButtonStyle
//                 : buttonStyle
//             }
//             onClick={() => setSelectedOption("withoutDetection")}
//           >
//             Without asset part detection
//           </button>
//         </div>

//         <button
//           style={isProcessing ? processingButtonStyle : buttonStyle}
//           onClick={async (e) => {
//             e.preventDefault();
//             setIsProcessing(true);
//             await onSubmit();
//             setIsProcessing(false);
//           }}
//           disabled={isProcessing}
//         >
//           Run
//         </button>
//       </div>
//       <div>Remaining time: {remainingTime}</div>{" "}
//       {/* Display the remaining time */}
//       {/* Display notification when analysis is complete */}
//       {analysisComplete && (
//         <div
//           style={{ marginTop: "20px", color: "#007BFF", fontWeight: "bold" }}
//         >
//           Analysis is complete!
//         </div>
//       )}
//     </div>
//   );
// };

// export { ThreeImages };

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import image1 from "../q0.png";
import image0 from "../q2.png";
import "./design.css";
const ThreeImages = () => {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnalysisBox, setShowAnalysisBox] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    flexDirection: "column",
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#007BFF",
    color: "white",
    fontWeight: "bold",
  };
  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#0056b3",
  };

  const processingButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#d1d1d1",
    cursor: "not-allowed",
  };

  const analysisBoxStyle = {
    border: "1px solid #007BFF",
    borderRadius: "5px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    width: "300px",
    margin: "0 auto",
    marginTop: "100px",
  };

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      withCredentials: true,
    });

    socket.on("progress-update", (data) => {
      setRemainingTime(data);
    });
    return () => socket.disconnect();
  }, []);

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      const blobData =
        location.state?.uploadedFileData?.map((fileData) => fileData.data) ||
        [];
      const filesData = location.state?.uploadedFileData
        ? location.state.uploadedFileData
        : [];
      // blobData.forEach((blob, index) => {
      //   const file = new File([blob], `image${index}.png`, {
      //     type: "image/png",
      //   });
      //   formData.append("images", file);
      // });
      filesData.forEach((singleFile, index) => {
        const file = new File([singleFile.data], singleFile.name, {
          type: "image/png",
        });
        formData.append("images", file);
      });

      formData.append("selectedOption", selectedOption);
      console.log(formData);
      const res = await axios.post(
        `http://localhost:4000/images/autoAnalysis/${location.state.folderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "json",
        }
      );

      setAnalysisComplete(true);
    } catch (err) {
      if (err.response.status === 500) {
        console.log(err);
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  return (
    <div className="seletcion_content">
      {showAnalysisBox ? (
        <div style={analysisBoxStyle}>
          {analysisComplete ? (
            <>
              <h3>Hurray...</h3>
              <p>Your analyses is done!!!</p>
              <p>Please check the origin folder.</p>
            </>
          ) : (
            <>
              <p>Your analysis in progress…</p>
              <p>{remainingTime} secs to go</p>
              <p><span className="loader"></span></p>
              <p><span className="loader1"></span></p>
            </>
          )}
        </div>
      ) : (
        <div >
          <div className="text_inside"
            // style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <div className="image_stack">
              <img src={image0} className="image_size_1"/>
            <button className="btn_selection_1"
              //style={selectedOption === "withDetection" ? activeButtonStyle: buttonStyle }
              onClick={() => setSelectedOption("withDetection")}
            >
              With automated asset part detection
            </button>
            </div>
            <div className="image_stack">
            <img src={image1} className="image_size_1"/>
            <button className="btn_selection_1"
              //style={selectedOption === "withoutDetection"? activeButtonStyle: buttonStyle}
              onClick={() => setSelectedOption("withoutDetection")}
            >
              Without asset part detection
            </button>
            </div>
          </div>
          <div className="run_button">
          <button className="btn_run"
           // style={isProcessing ? processingButtonStyle : buttonStyle}
            onClick={async () => {
              setIsProcessing(true);
              setShowAnalysisBox(true);
              await onSubmit();
              setIsProcessing(false);
            }}
            disabled={isProcessing}
          >
            Run
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { ThreeImages };
