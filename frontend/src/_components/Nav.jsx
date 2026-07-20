import React, { useState, useEffect } from "react";
import { NavLink, Route } from "react-router-dom";
import {FaImage, FaVideo} from "react-icons/fa";
import {IoMdAnalytics, IoIosLogOut, IoIosImages} from "react-icons/io";
import {AiFillHome, AiFillProfile} from "react-icons/ai";
import { Role } from "@/_helpers";
import { accountService } from "@/_services";
import PlainHeader from "./PlainHeader";
import "./navStyles.css"; // Import the custom CSS file

function Nav() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const subscription = accountService.user.subscribe((x) => setUser(x));
    return subscription.unsubscribe;
  }, []);

  // only show nav when logged in
  if (!user) return <PlainHeader />;

  return (
    <div>
      <PlainHeader className="makeStyles-appBar-1"/>
      {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
      <nav className="navbar_navbar-expand_navbar-dark">
        <div className="navbar-nav">
          <NavLink
            exact
            to="/"
            className="nav-item_nav-link"
            id={window.location.pathname == "/" ? "active" : ""}
          >
            {" "}
            <div className="icon">
              <AiFillHome />
            </div>{" "}
            <div className="title">Home</div>
          </NavLink>
          {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
          {/* <NavLink
            to="/profile"
            className="nav-item_nav-link"
            id={window.location.pathname == "/profile" ? "active" : ""}
          >
            {" "}
            <div className="icon">
              <AiFillProfile />
            </div>{" "}
            <div className="title">Profile</div>
          </NavLink> */}
          {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
          <NavLink
            to="/imageHome"
            className="nav-item_nav-link"
            id={window.location.pathname == "/imageHome" ? "active" : ""}
          >
            {" "}
            <div className="icon">
              <IoIosImages />
            </div>{" "}
            <div className="title">Folder</div>
          </NavLink>
          {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
          <NavLink
            to="/imageList"
            className="nav-item_nav-link"
            id={window.location.pathname == "/imageList" ? "active" : ""}
          >
            {" "}
            <div className="icon">
              <FaImage />
            </div>{" "}
            <div className="title">Image</div>
          </NavLink>
          {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
          <NavLink
            to="/video"
            className="nav-item_nav-link"
            id={window.location.pathname == "/video" ? "active" : ""}
          >
            {" "}
            <div className="icon">
              <FaVideo />
            </div>{" "}
            <div className="title">Video</div>
          </NavLink>
          {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
          <NavLink
            to="/imageanalysis"
            className="nav-item_nav-link"
            id={window.location.pathname == "/imageanalysis" ? "active" : ""}
          >
            {" "}
            <div className="icon">
              <IoMdAnalytics />
            </div>{" "}
            <div className="title">Analysis Dashboard</div>
          </NavLink>
          {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
          {/* {user.role === Role.Admin && (
            <NavLink
              to="/admin"
              className="nav-item_nav-link"
              id={window.location.pathname == "/admin" ? "active" : ""}
            >
              {" "}
              <div className="icon">
                <FaIcons.FaUserSecret />
              </div>{" "}
              <div className="title">Admin</div>
            </NavLink>
          )} */}
          {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
          <a onClick={accountService.logout} className="nav-item_nav-link">
            {" "}
            <div className="icon">
              <IoIosLogOut />
            </div>
            {""}
            <div className="title">Logout</div>
          </a>
        </div>
      </nav>
      <Route path="/admin" component={AdminNav} />
    </div>
  );
}

function AdminNav({ match }) {
  const { path } = match;

  return (
    <nav className="admin-nav navbar navbar-expand navbar-light">
      <div className="navbar-nav">
        <NavLink to={`${path}/users`} className="nav-item nav-link"></NavLink>
      </div>
    </nav>
  );
}

export { Nav };
