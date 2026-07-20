import React, { useState, useRef } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import regeneratorRuntime from "regenerator-runtime";
import Dropzone from "react-dropzone";
import axios from "axios";
import { accountService } from "@/_services";

const ImageHome = (props) => {
  const [file, setFile] = useState(null); // state for storing actual image
  const [previewSrc, setPreviewSrc] = useState(""); // state for storing previewImage
  const [state, setState] = useState({
    title: "",
    description: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const dropRef = useRef(); // React ref for managing the hover state of droppable area
  const user = accountService.userValue;

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
  };
  const updateBorder = (dragState) => {
    if (dragState === "over") {
      dropRef.current.style.border = "2px solid #000";
    } else if (dragState === "leave") {
      dropRef.current.style.border = "2px dashed #e9ebeb";
    }
  };
  const handleOnSubmit = async (event) => {
    event.preventDefault();

    try {
      const { title, description } = state;
      if (title.trim() !== "" && description.trim() !== "") {
        if (file) {
          const formData = new FormData();

          formData.append("image", file);
          formData.append("title", title);
          formData.append("description", description);
          formData.append("userId", user.id);
          setErrorMsg("");
          await axios.post(`http://localhost:4000/images/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          props.history.push("/imageList");
        } else {
          setErrorMsg("Please select a file to add.");
        }
      } else {
        setErrorMsg("Please enter all the field values.");
      }
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };

  return (
    <Form
      className="search-form"
      onSubmit={handleOnSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      <div>
        <form>
          <Row alignItem="center">
            <Col>
              <Form.Group controlId="title">
                <Form.Control
                  type="text"
                  name="title"
                  value={state.title || ""}
                  placeholder="Enter title"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </form>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <form>
          <Row>
            <Col>
              <Form.Group controlId="description">
                <Form.Control
                  type="text"
                  name="description"
                  value={state.description || ""}
                  placeholder="Enter description"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </form>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div className="upload-section">
          <Dropzone
            onDrop={onDrop}
            onDragEnter={() => updateBorder("over")}
            onDragLeave={() => updateBorder("leave")}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps({ className: "drop-zone" })}
                ref={dropRef}
                style={{
                  border: "solid",
                  padding: "10px",
                  backgroundColor: "white",
                }}
              >
                <input {...getInputProps()} />

                <b>
                  {" "}
                  <p alignItem="Center">
                    Drag and drop a file OR click here to select a file
                  </p>
                </b>

                {file && (
                  <div>
                    <strong>Selected file:</strong> {file.name}
                  </div>
                )}
              </div>
            )}
          </Dropzone>

          {previewSrc ? (
            isPreviewAvailable ? (
              <div className="image-preview" alignItem="Center">
                <img
                  className="preview-image"
                  src={previewSrc}
                  alt="Preview"
                  width="600"
                  height="600"
                />
              </div>
            ) : (
              <div className="preview-message">
                <p>No preview available for this file</p>
              </div>
            )
          ) : (
            <div className="preview-message">
              <p style={{ color: "white" }}>
                {" "}
                Image preview will be shown here after selection
              </p>
            </div>
          )}
        </div>
      </div>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Button
        variant="secondary"
        size="large"
        color="#59d959"
        component="span"
        border="ridge black"
        type="submit"
      >
        Submit
      </Button>
    </Form>
  );
};

export { ImageHome };
