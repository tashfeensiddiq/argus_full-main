// import { Grid } from "@material-ui/core";
// import React from "react";
// import clsx from "clsx";
// import { makeStyles, useTheme } from "@material-ui/core/styles";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
// import Text from "react-text";

// const drawerWidth = 240;

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//   },
//   appBar: {
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     // hex code for green
//     background: "#4caf50",
//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginLeft: -drawerWidth,
//   },
//   logo: {
//     width: 50,
//     height: 50,
//   },
//   title: {
//     display: "flex",
//     alignItems: "center",
//     flexWrap: "wrap",
//   },
//   Logtext: {
//     fontSize: "1000",
//     lineHeight: "100",
//     color: "red",
//   },
// }));

// function PlainHeader() {
//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <CssBaseline />
//       <AppBar position="fixed" className={classes.appBar}>
//         <Toolbar>
//           <Grid container justifyContent="center" alignItems="center">
//             <div className={classes.title}>
//               {/* <img src="../logo.png" className={classes.logo} /> */}
//               {/* <Typography variant="h4" className={classes.typographyStyle}>
//                   Argus 1.21

//                 </Typography> */}
//               {/* <Text className={"Logtext"}>Powered by qualiTEAS</Text> */}

//               <Typography variant="h4" className={classes.typographyStyle}>
//                 Argus 1.21
//                 <sub className={classes.sub}>Powered by qualiTEAS</sub>
//               </Typography>
//             </div>
//           </Grid>
//         </Toolbar>
//       </AppBar>
//       <main className={classes.content}></main>
//     </div>
//   );
// }

// export default PlainHeader;

import { Grid } from "@material-ui/core";
import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import * as FaIcons from "react-icons/fa";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { NavLink, Route } from "react-router-dom";
import Text from "react-text";
import "./navStyles.css";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // hex code for green
    background: "#59d959",
  },
  // #4caf50
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    display: "flex",
    alignItems: "left",
    flexWrap: "wrap",
  },
  Logtext: {
    fontSize: "1000",
    lineHeight: "100",
  },
}));

function PlainHeader() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Grid container justifyContent="flex-start" alignItems="center">
            <div className={classes.title}>
              {/* <img src="../logo.png" className={classes.logo} /> */}
              {/* <Typography variant="h4" className={classes.typographyStyle}>
                  Argus 1.21


                 
                </Typography> */}
              {/* <Text className={"Logtext"}>Powered by qualiTEAS</Text> */}
              <Typography variant="h4" className={classes.typographyStyle}>
                {console.log(classes.typographyStyle)}
                Argus 1.21
                <sub className={classes.sub}>
                  Powered by{" "}
                  <a
                    href="https://qualiteas.ca/"
                    target="_blank"
                    className="hy_li"
                  >
                    qualiTEAS
                  </a>
                </sub>
              </Typography>
            </div>
          </Grid>
          <NavLink
            to="/profile"
            className="profile_icon"
            id={window.location.pathname == "/profile" ? "active" : ""}
          >
            {" "}
            <div className="profile_icon_icon">
              <FaIcons.FaUserCircle />
            </div>{" "}
          </NavLink>
        </Toolbar>
      </AppBar>
      <main className={classes.content}></main>
    </div>
  );
}

export default PlainHeader;
