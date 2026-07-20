import axios from "axios";
import React, { Fragment, useState } from "react";
import download from "downloadjs";

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const onChange = (e) => {
    console.log(e.target.files);
    setFiles(e.target.files);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let coordArray = [
      [0, 0],
      [0, 64],
      [64, 0],
      [64, 64],
    ];

    const formData = new FormData();
    Object.values(files).forEach((file) => {
      formData.append("images", file);
      formData.append("coordArray", coordArray);
    });

    try {
      const res = await axios.post(
        // "http://localhost:4000/images/autoAnalysis",
        // "http://localhost:4000/images/imageBgCropping",
        // "http://20.69.146.171:4000/images/autoAnalysis",

        "http://localhost:4000/images/imageBgRemoveDrawing",
        // "http://localhost:4000/images/afterbg_calculation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "json",
        }
      );
      return download(res.data, "images_analysis", "application/zip");
      // console.log(res.data);
    } catch (err) {
      if (err.response.status === 500) {
        console.log(err);
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  return (
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
  );
};

export default FileUpload;
