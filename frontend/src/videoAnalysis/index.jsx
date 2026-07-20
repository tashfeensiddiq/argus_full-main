// import React, { useState } from "react";
// import axios from "axios";

// function MyVideoUploader() {
//   const [file, setFile] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);

//   const handleFileInput = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleSubmit = () => {
//     // Create a FormData object to store the video file
//     const formData = new FormData();
//     formData.append("videoFile", file);

//     // Send the file to the server using Axios
//     axios.post("/upload", formData).then((response) => {
//       // Once the video is done processing, save the URL of the processed video
//       // so we can display it in the render method
//       setVideoUrl(response.data.videoUrl);
//     });
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileInput} />
//       <button onClick={handleSubmit}>Submit</button>

//       {videoUrl && (
//         // If a video URL is available, display the video
//         <video src={videoUrl} />
//       )}
//     </div>
//   );
// }
