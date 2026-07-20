import React, { useState } from "react";

function ImageTable(props) {
  const {
    imageList,
    handleCheckboxChange,
    selectedImages,
    handleSelectedImagesSubmit,
  } = props;

  return (
    <table>
      <thead>
        <tr >
          <th>Select</th>
          <th>Image Name</th>
          <th>Image</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        {imageList.map((imageData, index) => (
          <tr key={index} id={(imageData.percentage >= 10)? "active" : "" } >
            <td>
              <input
                type="checkbox"
                checked={selectedImages.some(
                  (selectedImage) => selectedImage.name === imageData.name
                )}
                onChange={(event) => handleCheckboxChange(event, imageData)}
              />
            </td>
            <td>{imageData.name}</td>
            <td>
              <img src={imageData.image} alt={imageData.name} />
            </td>
            <td>{imageData.percentage}</td>
          </tr>
        ))}
      </tbody>
      <button
        onClick={() => {
          handleSelectedImagesSubmit("0");
        }}
      >
        Submit Selected Images
      </button>
    </table>
  );
}

export default ImageTable;
