import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ImageTable from "./ImageTable";

const ThreeImages = () => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [files, setFiles] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  // const [imageDataList, setImageDataList] = useState([]);

  useEffect(() => {
    console.log(checkedItems);
  }, [checkedItems]);

  const onChange = (e) => {
    setFiles(e.target.files);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.values(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await axios.post(
        "http://localhost:4000/images/autoAnalysis",
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
      console.log(res);

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
    <div>
      <Fragment>
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

          <input type="submit" value="Run" />
        </form>
      </Fragment>

      {filesArray.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {filesArray.splice(currentGroup * 3, 3).map((file, index) => {
            const groupIndex = currentGroup * 3 + index;
            return (
              <div key={index}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <img
                    src={file}
                    style={{ width: "300px", height: "300px", margin: "10px" }}
                  />
                  {/* {index % 3 === 0 && (
                    <Link
                      to={{
                        pathname: "/imageCropping",
                        state: { image: file },
                      }}
                    >
                      <button>Go to Cropping</button>
                    </Link>
                  )} */}
                </div>
              </div>
            );
          })}
          <div>
            <button onClick={handleDownload}>Download Excel File</button>
          </div>
        </div>
      ) : (
        <></>
      )}

      {currentGroup > 0 && <button onClick={handlePrevGroup}>Prev</button>}
      {filesArray.length > currentGroup * 3 + 2 && (
        <button onClick={handleNextGroup}>Next</button>
      )}
      {/* <ImageTable
        imageList={imageDataList}
        handleCheckboxChange={handleCheckboxChange}
        selectedImages={checkedItems}
        handleSelectedImagesSubmit={handleSelectedImagesSubmit}
      /> */}
    </div>
  );
};

export { ThreeImages };
