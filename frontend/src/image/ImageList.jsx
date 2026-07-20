import React, { useState, useEffect } from "react";
import download from "downloadjs";
import { accountService } from "@/_services";

import axios from "axios";
import ImageCropping from "../imageAnalysis/ImageCropping";

import Plot from "react-plotly.js";
import Chart from "react-apexcharts";
import { Button } from "@material-ui/core";
import { Modal } from "@/_components";
import "./tables.css";;
const ImageList = () => {
  const [filesList, setFilesList] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [imageSrc, setImage] = useState("");
  const [loaded, setloaded] = useState(false);
  const [imageId, setImageId] = useState("");
  const [corrosionImageArray, setCorrosionImageArray] = useState([]);
  const [corrosionPercentage, setCorrosionPercentage] = useState([]);
  const [severeImageArray, setSevereImageArray] = useState([]);
  const [severePercentage, setSeverePercentage] = useState([]);
  const [tempCorrosionImage, setTempCorrosionImage] = useState([]);
  const [tempCorrosionPercentage, setTempCorrosionPercentage] = useState([]);
  const [tempSevereImage, setTempSevereImage] = useState([]);
  const [tempSeverePercentage, setTempSeverePercentage] = useState([]);
  const [chartStatus, setChartStatus] = useState(false);
  const [checkedCorrosionPercentage, setCheckedCorrosionPersentage] =
    useState("");
  const [pieChartSeries, setPieChartSeries] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const user = accountService.userValue;

  useEffect(() => {
    const getFilesList = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/images/getImages/${user.id}`
        );
        setErrorMsg("");
        setFilesList(data);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };

    getFilesList();
  }, []);

  const deleteFile = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/images/fileDelete/${id}`);
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg("Error while deleting file. Try again later");
      }
    }
  };

  const analyzeFile = async (id) => {
    try {
      const result = await axios.get(
        `http://localhost:4000/images/download/${id}`,
        {
          responseType: "blob",
        }
      );

      let src = URL.createObjectURL(result.data);
      setImage(src);
      setImageId(id);
      setloaded(true);
      setErrorMsg("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg("Error while downloading file. Try again later");
      }
    }
  };

  const downloadFile = async (id, path, mimetype) => {
    try {
      const result = await axios.get(
        `http://localhost:4000/images/download/${id}`,
        {
          responseType: "blob",
        }
      );
      const split = path.split("/");
      const filename = split[split.length - 1];

      setErrorMsg("");
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg("Error while downloading file. Try again later");
      }
    }
  };

  const onChangeSeverePercentage = (e) => {
    const isChecked = e.target.checked;

    const words = e.target.value.split(",");

    if (isChecked) {
      setCorrosionImageArray([...corrosionImageArray, words[0]]);
      setCorrosionPercentage([...corrosionPercentage, words[1]]);
      setSevereImageArray([...severeImageArray, words[2]]);
      setSeverePercentage([...severePercentage, words[3]]);
    } else {
      const index_one = corrosionImageArray.indexOf(words[0]);
      corrosionImageArray.splice(index_one, 1);
      setCorrosionImageArray(corrosionImageArray);
      //
      const index_two = corrosionPercentage.indexOf(words[1]);
      corrosionPercentage.splice(index_two, 1);
      setCorrosionPercentage(corrosionPercentage);
      //
      const index_three = severeImageArray.indexOf(words[2]);
      severeImageArray.splice(index_three, 1);
      setSevereImageArray(severeImageArray);
      //
      const index_four = severePercentage.indexOf(words[3]);
      severePercentage.splice(index_four, 1);
      setSeverePercentage(severePercentage);
    }
    // console.log(corrosionImageArray);
  };

  const dataGeneration = () => {
    setTempCorrosionImage(corrosionImageArray);
    setTempCorrosionPercentage(corrosionPercentage);
    setTempSevereImage(severeImageArray);
    setTempSeverePercentage(severePercentage);
    setChartStatus(true);
  };
  const dataClear = () => {
    setTempCorrosionImage([]);
    setTempCorrosionPercentage([]);
    setTempSevereImage([]);
    setTempSeverePercentage([]);
    setChartStatus(false);
  };

  const chartGeneration = () => {
    const corrosionArray = {
      x: tempCorrosionImage,
      y: tempCorrosionPercentage,
      name: "Corrosion",
      type: "bar",
      text: tempCorrosionPercentage.map(String),
    };

    const severeArray = {
      x: tempSevereImage,
      y: tempSeverePercentage,
      name: "Severe",
      type: "bar",
      text: tempSeverePercentage.map(String),
    };

    const data = [corrosionArray, severeArray];

    return data;
  };
  const onChangeFileSelection = (e) => {
    console.log(e.target.value);
    const nonCorrosionPercentage = 100 - e.target.value;
    console.log(nonCorrosionPercentage);
    if (checkedCorrosionPercentage === e.target.value) {
      setCheckedFolder("");
      setPieChartSeries("");
    } else {
      setCheckedCorrosionPersentage(e.target.value);
      setPieChartSeries([
        Number(e.target.value),
        Number(nonCorrosionPercentage),
      ]);
    }
  };

  return (
    <>
      {loaded ? (
        <ImageCropping inputImage={imageSrc} id={imageId} />
      ) : (
        <div className="files-container">
          {errorMsg && <p className="errorMsg">{errorMsg}</p>}
          <table className="files-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Download</th>
                <th>Analysis</th>
                <th>Corrosion Image</th>

                <th id="active"> Total Corrosion %</th>
                <th>Severe Corrosion Image</th>
                <th>Severe Corrosion %</th>
                <th>Select bar chart</th>
                <th>Select Pie chart</th>
                <th>Data Delete</th>
              </tr>
            </thead>
            <tbody>
              {filesList.length > 0 ? (
                filesList.map(
                  ({
                    _id,
                    title,
                    description,
                    file_path,
                    file_mimetype,
                    corrosion_file_name,
                    corrosion_file_percentage,
                    severe_file_name,
                    severe_file_percentage,
                  }) => (
                    <tr className='row_color' key={_id} id={(corrosion_file_percentage >= 10)? "active" : "" }>
                      <td className="file-title">{title}</td>
                      
                      <td className="file-description">{description}</td>
                      <td>
                        <a
                          onClick={() =>
                            downloadFile(_id, file_path, file_mimetype)
                          }
                        >
                          Download
                        </a>
                      </td>
                      <td className="file-analysis">
                        <a onClick={() => analyzeFile(_id)}>File analysis</a>
                      </td>

                      <td className="corrosion-image">{corrosion_file_name}</td>

                      <td className="corrosion-percentage">
                        {corrosion_file_percentage}
                      </td>

                      <td className="severe-corrosion-image">
                        {severe_file_name}
                      </td>

                      <td className="severe-corrosion-percentage">
                        {severe_file_percentage}
                      </td>
                      <td className="chart-selection">
                        <input
                          type="checkbox"
                          name="severe-corrosion-percentage"
                          value={[
                            corrosion_file_name,
                            corrosion_file_percentage,
                            severe_file_name,
                            severe_file_percentage,
                          ]}
                          onChange={onChangeSeverePercentage}
                        />
                      </td>
                      <td className="pie-chart-selection">
                        <input
                          checked={
                            checkedCorrosionPercentage ===
                            corrosion_file_percentage
                          }
                          type="checkbox"
                          name="percentage"
                          value={corrosion_file_percentage}
                          onChange={onChangeFileSelection}
                        />
                      </td>
                      <td className="data-delete">
                        <a onClick={() => handleClickOpen()}>Delete file</a>
                      </td>

                      <Modal
                        open={open}
                        handleClose={handleClose}
                        handleSubmit={deleteFile}
                        id={_id}
                      />
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={3} style={{ fontWeight: "300" }}>
                    No files found. Please add some.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              onClick={dataGeneration}
              variant="contained"
              size="small"
              color="#59d959"
              component="span"
              border="ridge"
            >
              Submit
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              onClick={dataClear}
              variant="contained"
              size="small"
              color="#59d959"
              component="span"
              border="ridge"
            >
              Clear Chart
            </Button>
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div className="chart" style={{ "text-align": "center" }}>
            {chartStatus ? (
              <Plot 
                data={chartGeneration()}
                layout={{
                  border: "10px solid black",
                  color: "blue",
                  width: 300,
                  height: 300,
                  title: "Corrosion% and Severe%",
                  yaxis: {
                    title: "Corrosion%",
                    titlefont: {
                      size: 16,
                      color: "rgb(107, 107, 107)",
                    },
                    tickfont: {
                      size: 14,
                      color: "rgb(107, 107, 107)",
                    },
                  },
                }}
              />
            ) : (
              <></>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Chart
              options={{
                colors: ["#B7410E", "#71797E"],
                labels: ["corrosion", "non-corrosion"],
              }}
              type="donut"
              width="380"
              series={pieChartSeries}
            />
          </div>
        </div>
      )}
    </>
  );
};

export { ImageList };
