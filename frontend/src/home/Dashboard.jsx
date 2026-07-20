// import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import Alert from "react-bootstrap/Alert";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// const useStyles = makeStyles((theme) => ({
//   styl: {
//     opacity: 0.9,
//     padding: "1.5rem",
//     width: "75%",
//     margin: "auto",
//     color: "green",
//     justifyContent: "center",
//   },
//   obj: {
//     justifyContent: "center",
//     color: "white",

//     hyp: {
//       color: "black",
//     },
//   },
// }));

// function Dashboard(prop) {
//   return (
//     <div
//       style={{ color: "black", height: "75vh" }}
//       className={"flow-text black-textcol"}
//       // style={{ height: "75vh" }}
//       // className={"container valign-wrapper"}
//     >
//       ,
//       <div className="row">
//         <div style={{ color: "black" }} className="s12 center-align">
//           <h3>
//             <b>
//               &ndsp;&ndsp;&ndsp;&ndsp;&ndsp;&ndsp;&ndsp;&ndsp;&ndsp;&ndsp;&ndsp;&ndsp;&ndsp;&ndsp;&ndsp;Hello,
//             </b>
//             {prop.user}

//             <Alert variant="dark">
//               <p className="flow-text black-text text-darken-1">
//                 &ndsp;&ndsp;&ndsp;&ndsp;&ndsp;You are logged into Argus
//                 1.21(Above-the-water)
//               </p>
//             </Alert>
//           </h3>
//         </div>

//         <Alert variant="success">
//           <Alert.Heading>
//             <b>
//               Argus has been made to simplify complexities for its users, and
//               hence can be used in just six easy steps:
//             </b>
//           </Alert.Heading>

//           <p>1. Click on the “Analysis” button at the top menu bar</p>
//           <p>2. Upload an image.</p>
//           <p>3. Select part of the asset that is of interest.</p>
//           <p>4. Click on the “Analyze” button at the left side of the page.</p>
//           <p>5. Wait for a few seconds as Argus runs the analysis.</p>
//           <p>
//             6. Download the comparative image: Input image, alongside the
//             analyzed image
//           </p>
//           <p>
//             7. To analyze the severity of corrosion, click on the “Severe
//             Corrosion Analysis” button at the left side of the page.
//           </p>
//           <p>8. Wait for a few seconds as Argus runs the analysis</p>
//           <p>
//             9. Download the comparative image: Analyzed image from the previous
//             analysis (total corrosion), alongside the image with severe
//             corrosion (if any).
//           </p>

//           <hr />
//           <p className={"mb-0"}>
//             Need further assistance? We are happy to help, please contact us on{" "}
//             <b>argus_support@qualiteas.ca</b>
//           </p>
//         </Alert>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
