import {
  FETCH_IMAGES,
  FETCH_IMAGE_DETAIL,
  ADD_IMAGE,
  UPLOAD_ORIGINALIMAGE,
  REMOVE_ORIGINALIMAGE,
} from "../_actions/type";

const initialState = {
  imageList: [],
  imageDetail: {},
};

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_IMAGES:
      return {
        imageList: [...action.payload.result],
      };
    case FETCH_IMAGE_DETAIL:
      return {
        imageDetail: action.payload.result,
      };
    case UPLOAD_ORIGINALIMAGE:
      return {
        imageDetail: action.payload.result,
      };
    case REMOVE_ORIGINALIMAGE:
      return {
        imageDetail: action.payload.result,
      };
    default:
      return state;
  }
};

export default imageReducer;
