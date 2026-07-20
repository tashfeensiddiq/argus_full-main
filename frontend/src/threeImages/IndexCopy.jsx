import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ImageTable from "./ImageTable";
import DrawableImage from "./DrawableImage";
import { saveAs } from "file-saver";
import { useLocation } from "react-router-dom";

const ThreeImages = () => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [files, setFiles] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  // const [imageDataList, setImageDataList] = useState([]);
  const [updatedImage, setUpdatedImage] = useState("");
  const location = useLocation();
  const [fileInfos, setFileInfos] = useState([]); // For file metadata
  const [fileBlobs, setFileBlobs] = useState([]); // For blob data

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px", // space between buttons
    flexDirection: "column", // stack vertically
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#007BFF", // Bootstrap primary color
    color: "white",
    fontWeight: "bold",
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.uploadedFiles) {
        setFileInfos(location.state.uploadedFiles);
      }
      if (location.state.uploadedFileData) {
        const blobData = location.state.uploadedFileData.map(
          (fileData) => fileData.data
        );

        setFileBlobs(blobData);
      }
    }
  }, [location]);

  const onChange = (e) => {
    setFiles(e.target.files);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log("fileBlog is: ", fileBlobs);

    // Object.values(files).forEach((file) => {
    //   formData.append("images", file);
    // });

    fileBlobs.forEach((blob, index) => {
      const file = new File([blob], `image${index}.png`, { type: "image/png" }); // or whatever the type and name should be
      formData.append("images", file);
    });
    try {
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
      window.location.reload(true);
      const jsonData = res.data;
      localStorage.setItem(
        "bgImages",
        JSON.stringify(jsonData.bgPathFileArray)
      );
      localStorage.setItem(
        "calculatedImages",
        JSON.stringify(jsonData.calculatedPathFileArray)
      );
      localStorage.setItem(
        "originalImages",
        JSON.stringify(jsonData.originalPathFileArray)
      );
      localStorage.setItem(
        "datasheets",
        JSON.stringify(jsonData.datasheetPathFileArray)
      );
      const percentages = jsonData.percentages
        .map((item) => parseFloat(item.calculatedPercentage.toFixed(2)))
        .reverse();
      console.log(percentages);
      const originalPaths = jsonData.originalPathFileArray;
      const updatedImageDataList = originalPaths.map((path, i) => {
        const imageName = path.split("/").pop(); // extract the image name from the URL
        return {
          name: imageName,
          image: path,
          percentage: percentages[i], // hard-coded percentage for now
        };
      });
      // setImageDataList(updatedImageDataList);
      localStorage.setItem(
        "imageDataList",
        JSON.stringify(updatedImageDataList)
      );

      // Initialize checked items array
      // setCheckedItems(
      //   new Array(Math.ceil(jsonData.bgPathFileArray.length / 3)).fill(false)
      // );
    } catch (err) {
      if (err.response.status === 500) {
        console.log(err);
      } else {
        console.log(err.response.data.msg);
      }
    }
  };
  const handleSelectedImagesSubmit = async (flag) => {
    // Handle the submission logic here
    // You can send the checkedItems data to your backend
    const data = { checkedItems, flag };
    try {
      const res = await axios.post(
        "http://localhost:4000/images/imagePercentageCompare",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const imageResponse = await axios.get(res.data.finalOutput, {
        //http://localhost:4000/bg_images/datasheet/compare.png
        responseType: "blob", // Important
      });

      const blob = new Blob([imageResponse.data], { type: "image/png" });
      saveAs(blob, "compare.png");

      // Handle the response here, e.g., update the state, show a success message, etc.
    } catch (err) {
      console.log(err);
    }
  };

  const handleNextGroup = () => {
    setCurrentGroup(currentGroup + 1);
  };

  const handlePrevGroup = () => {
    setCurrentGroup(currentGroup - 1);
  };

  const handleCheckboxChange = (event, imageData) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setCheckedItems([...checkedItems, imageData]);
    } else {
      const updatedItems = checkedItems.filter(
        (img) => img.name !== imageData.name
      );
      setCheckedItems(updatedItems);
      // console.log(checkedItems);
    }
  };

  const bgImages = JSON.parse(localStorage.getItem("bgImages")) || [];
  const calculatedImages =
    JSON.parse(localStorage.getItem("calculatedImages")) || [];
  const originalImages =
    JSON.parse(localStorage.getItem("originalImages")) || [];
  const datasheets = JSON.parse(localStorage.getItem("datasheets")) || [];
  const imageDataList = JSON.parse(localStorage.getItem("imageDataList")) || [];
  // use spread operator to copy the content of the FileList into a new array
  const filesArray = [];
  for (let i = 0; i < bgImages.length; i++) {
    filesArray.push(originalImages[i], bgImages[i], calculatedImages[i]);
  }
  const datasheetUrl = datasheets[0];
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = datasheetUrl;
    link.download = "demo.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {" "}
      {/* Center everything and add some top margin */}
      <div style={buttonContainerStyle}>
        {/* Commenting out the file selection as per your instruction */}
        {/* <Fragment>
          <form onSubmit={onSubmit}>
            <div>
              <input
                type="file"
                id="file"
                name="uploadImages"
                multiple
                onChange={onChange}
              />
            </div>
          </form>
        </Fragment> */}

        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button style={buttonStyle}>
            With automated asset part detection
          </button>
          <button style={buttonStyle}>Without asset part detection</button>
        </div>

        <button style={buttonStyle} onClick={onSubmit}>
          Run
        </button>
      </div>
      {/* Displaying the images */}
      {filesArray.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          {filesArray.splice(currentGroup * 3, 3).map((file, index) => {
            const groupIndex = currentGroup * 3 + index;
            return (
              <div key={index}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {index % 3 === 0 ? (
                    <DrawableImage
                      src={file}
                      onUpdate={(updatedImg) => setUpdatedImage(updatedImg)}
                      updatedImage={updatedImage}
                    />
                  ) : index % 3 === 1 ? (
                    <img
                      src={updatedImage ? updatedImage : file}
                      style={{
                        width: "300px",
                        height: "300px",
                        margin: "10px",
                      }}
                    />
                  ) : (
                    <img
                      src={file}
                      style={{
                        width: "300px",
                        height: "300px",
                        margin: "10px",
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Navigation buttons */}
      <div style={{ marginTop: "20px" }}>
        {currentGroup > 0 && <button onClick={handlePrevGroup}>Prev</button>}
        {filesArray.length > currentGroup * 3 + 2 && (
          <button onClick={handleNextGroup}>Next</button>
        )}
      </div>
    </div>
  );
};
{
  /* <ImageTable
        imageList={imageDataList}
        handleCheckboxChange={handleCheckboxChange}
        selectedImages={checkedItems}
        handleSelectedImagesSubmit={handleSelectedImagesSubmit}
      /> */
}
{
  /* <div>
            <button onClick={handleDownload}>Download Excel File</button>
          </div> */
}

export { ThreeImages };
