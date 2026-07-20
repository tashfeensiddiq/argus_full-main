// import React, { useState } from "react";

// import { accountService } from "@/_services";
// import { makeStyles } from "@material-ui/core/styles";
// import Alert from "react-bootstrap/Alert";
// import FileUpload from "../fileSystem/FileUpload";
// import '../work_partition.css'
// function Home() {
//   const user = accountService.userValue;

//   return (
//     <div className="work_partition">
//       <div className="container">
//         <b>
//           <h1>
//             {" "}
//             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//             Hi {user.firstName}
//           </h1>
//         </b>
//         <Alert variant="dark">
//           <p
//             justify-content="center"
//             className="flow-text black-text text-darken-1"
//           >
//             Hi {user.firstName}! You are logged into Argus 1.21(Above-the-water)
//           </p>
//         </Alert>
//         <Alert variant="success">
//           <Alert.Heading>
//             <h4>
//               <b>
//                 Argus has been made to simplify complexities for its users, and
//                 hence can be used in just nine easy steps:
//               </b>
//             </h4>
//           </Alert.Heading>

//           <h5>1. Click on the “Analysis” button at the top menu bar</h5>
//           <h5>2. Upload an image</h5>
//           <h5>3. Select the part of the asset that is of interest</h5>
//           <h5>
//             4. Click on the “Analyze” button at the right side of the page
//           </h5>
//           <h5>5. Wait for a few seconds as Argus runs the analysis</h5>
//           <h5>
//             6. Download the comparative image: Input image, alongside the
//             analyzed image
//           </h5>
//           <h5>
//             7. To analyze the severity of corrosion, click on the “Severe
//             Corrosion Analysis” button at the bottom
//           </h5>
//           <h5>8. Wait for a few seconds as Argus runs the analysis</h5>
//           <h5>
//             9. Download the comparative image: Analyzed image from the previous
//             analysis (total corrosion), alongside the image with severe
//             corrosion (if any).
//           </h5>

//           <hr />
//           <p className={"mb-0"}>
//             Need further assistance? We are happy to help, please contact us on{" "}
//             <b>argus_support@qualiteas.ca</b>
//           </p>
//         </Alert>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {/* <FileUpload /> */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export { Home };

import React, { useState } from "react";

import { accountService } from "@/_services";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "react-bootstrap/Alert";
import FileUpload from "../fileSystem/FileUpload";
import "../work_partition.css";
import "./animation.css";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
function Home() {
  const user = accountService.userValue;

  return (
    <div className="work_partition">
      <div className="container">
        <b>
          <h1>
            {" "}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Hi {user.firstName}
          </h1>
        </b>
        <Alert variant="dark">
          <p
            justify-content="center"
            className="flow-text black-text text-darken-1"
          >
            Hi {user.firstName}! You are logged into Argus 1.21(Above-the-water)
          </p>
        </Alert>
        <Alert variant="success">
          <Alert.Heading>
            <h4 className="a1 anim">
              <b>Welcome to Argus 1.21</b>
            </h4>
          </Alert.Heading>

          <br />
          <h5 className="a2 anim">
            <a href="/profile">
              <FaIcons.FaFolderPlus className="folder blink_anim"></FaIcons.FaFolderPlus>
            </a>{" "}
            You can create the folder, upload images and videos in the File
            Content
          </h5>
          <br />
          <h5 className="a3 anim">
            <a href="/imageHome">
              <FaIcons.FaImage className="image blink_anim"></FaIcons.FaImage>
            </a>{" "}
            Analysis of images can be done at the Image Analysis section
          </h5>
          <br />
          <h5 className="a4 anim">
            <a href="/threeImages">
              <FaIcons.FaVideo className="vid blink_anim"></FaIcons.FaVideo>
            </a>{" "}
            For video analysis, please use Video Analysis option
          </h5>
          <br />
          <h5 className="a5 anim">
            <a href="/imageanalysis">
              <IoIcons.IoMdAnalytics className="analysis blink_anim"></IoIcons.IoMdAnalytics>
            </a>{" "}
            Want to plot graph, chart or download a report? Please go to the
            Analysis dashboard section
          </h5>
          <br />

          <hr />
          <p className="a6 anim">
            Need further assistance? We are happy to help, please contact us on{" "}
            <b>argus_support@qualiteas.ca</b>
          </p>
        </Alert>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <FileUpload /> */}
        </div>
      </div>
    </div>
  );
}

export { Home };
