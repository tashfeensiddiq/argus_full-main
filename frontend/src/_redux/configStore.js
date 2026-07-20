import { createStore, compose, applyMiddleware } from "redux";
import promiseMiddleware from "redux-promise";
import reduxThunk from "redux-thunk";
import rootReducer from "../_reducers";

const composeEnhancers =
  process.env.NODE_ENV !== "production" &&
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        shouldHotReload: false,
      })
    : compose;

const configureStore = () => {
  const store = createStore(
    rootReducer,
    {},
    composeEnhancers(applyMiddleware(promiseMiddleware, reduxThunk))
  );
  return store;
};
export default configureStore;
