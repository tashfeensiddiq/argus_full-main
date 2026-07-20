import axios from "axios";
import {
  FETCH_IMAGES,
  FETCH_IMAGE_DETAIL,
  ADD_IMAGE,
  UPLOAD_ORIGINALIMAGE,
  REMOVE_ORIGINALIMAGE,
} from "./type";

export const fetchImages = () => {
  const req = axios.get("http://localhost:4000/images").then((res) => res.data);
  return {
    type: FETCH_IMAGES,
    payload: req,
  };
};
export const addImage = (data) => {
  const req = axios
    .post("http://localhost:4000/images/add", data)
    .then((res) => res.data);
  return {
    type: ADD_IMAGE,
    payload: req,
  };
};
export const uploadOriginalImages = (id, data, config) => {
  const req = axios
    .put(`http://localhost:4000/images/upload/${id}`, data, config)
    .then((res) => res.data);
  return {
    type: UPLOAD_ORIGINALIMAGE,
    payload: req,
  };
};
export const removeOriginalImages = (id, imageName) => {
  const req = axios
    .put(`http://localhost:4000/images/delete/${id}`, imageName)
    .then((res) => res.data);
  return {
    type: REMOVE_ORIGINALIMAGE,
    payload: req,
  };
};
export const fetchImageDetail = (id) => {
  const req = axios
    .get(`http://localhost:4000/images/${id}`)
    .then((res) => res.data);
  return {
    type: FETCH_IMAGE_DETAIL,
    payload: req,
  };
};
