// import React, { useState, useEffect } from "react";
// import { Route, Switch, Redirect, useLocation } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import { Role } from "@/_helpers";
// import { accountService } from "@/_services";
// import { Nav, PrivateRoute, Alert } from "@/_components";
// import { Home } from "@/home";
// import { Profile } from "@/profile";
// import { Admin } from "@/admin";
// import { Account } from "@/account";
// import { ImageAnalysis } from "@/imageAnalysis";
// import { ImageResult } from "@/imageResult";
// import { ImageComparison } from "@/imageComparison";
// import { ImageHome } from "@/image";
// import { ImageList } from "../image/ImageList";
// import { Folders } from "@/Folder";
// import { ThreeImages } from "@/threeImages";
// import { ImageDrawing } from "@/imageDrawing";
// import { ImageCropping } from "@/imageCropping";
// import Container from "../newFileSystem/Container";
// import ImageSelector from "../newImageSystem/ImageSelector";
// import VideoSelector from "../newVideoSystem/VideoSelector";
// // import {dashboard_analysis} from "@/imageanalysis_dashboard";
// import "./App.css";

// function App() {
//   const { pathname } = useLocation();
//   const [user, setUser] = useState({});

//   useEffect(() => {
//     const subscription = accountService.user.subscribe((x) => setUser(x));
//     return subscription.unsubscribe;
//   }, []);

//   return (
//     // <div className="app-container">
//     <div>
//       {/* <div className="nav-container"> */}
//       <Nav />
//       {/* </div> */}
//       <div className="content-container">
//         <Alert />
//         {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
//         <ToastContainer />
//         <Switch>
//           <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
//           <PrivateRoute exact path="/" component={Home} />
//           <PrivateRoute path="/imageHome" component={Container} />
//           <PrivateRoute path="/imageList" component={ImageSelector} />
//           <PrivateRoute path="/video" component={VideoSelector} />

//           <PrivateRoute path="/profile" component={Profile} />
//           <PrivateRoute path="/imageanalysis" component={ImageAnalysis} />
//           <PrivateRoute path="/imageResult" component={ImageResult} />
//           <PrivateRoute path="/imageComparison" component={ImageComparison} />
//           <PrivateRoute path="/folders" component={Folders} />
//           <PrivateRoute path="/threeImages" component={ThreeImages} />
//           <PrivateRoute path="/ImageDrawing" component={ImageDrawing} />
//           <PrivateRoute path="/ImageCropping" component={ImageCropping} />
//           <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
//           <Route path="/account" component={Account} />
//           <Redirect from="*" to="/" />
//         </Switch>
//       </div>
//     </div>
//   );
// }

// export { App };
import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Role } from "@/_helpers";
import { accountService } from "@/_services";
import { Nav, PrivateRoute, Alert } from "@/_components";
import { Home } from "@/home";
import { Profile } from "@/profile";
import { Admin } from "@/admin";
import { Account } from "@/account";
import { ImageAnalysis } from "@/imageAnalysis";
// import { dashboard_analysis } from "@/imageanalysis_dashboard";
import { ImageResult } from "@/imageResult";
import { ImageComparison } from "@/imageComparison";
import { ImageHome } from "@/image";
import { ImageList } from "../image/ImageList";
import { Folders } from "@/Folder";
import { ThreeImages } from "@/threeImages";
import { ImageDrawing } from "@/imageDrawing";
import { ImageCropping } from "@/imageCropping";
import Container from "../newFileSystem/Container";
import ImageSelector from "../newImageSystem/ImageSelector";
import VideoSelector from "../newVideoSystem/VideoSelector";
import ExcelSelector from "../newExcelSystem/ExcelSelector";
import { dashboard_analysis } from "@/imageanalysis_dashboard";
import "./App.css";

function App() {
  const { pathname } = useLocation();
  const [user, setUser] = useState({});

  useEffect(() => {
    const subscription = accountService.user.subscribe((x) => setUser(x));
    return subscription.unsubscribe;
  }, []);

  return (
    // <div className="app-container">
    <div>
      {/* <div className="nav-container"> */}
      <Nav />
      {/* </div> */}
      <div className="content-container">
        <Alert />
        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
        <ToastContainer />
        <Switch>
          <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute path="/imageHome" component={Container} />
          <PrivateRoute path="/imageList" component={ImageSelector} />
          <PrivateRoute path="/video" component={VideoSelector} />

          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/folders" component={Folders} />
          <PrivateRoute path="/threeImages" component={ThreeImages} />
          <PrivateRoute path="/imageanalysis" component={ExcelSelector} />
          <PrivateRoute
            path="/dashboard_analysis"
            component={dashboard_analysis}
          />

          {/* <PrivateRoute path="/imageResult" component={ImageResult} />
          <PrivateRoute path="/imageComparison" component={ImageComparison} />
          
          <PrivateRoute path="/ImageDrawing" component={ImageDrawing} />
          <PrivateRoute path="/ImageCropping" component={ImageCropping} />
          <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} /> */}
          <Route path="/account" component={Account} />
          <Redirect from="*" to="/" />
        </Switch>
      </div>
    </div>
  );
}

export { App };
