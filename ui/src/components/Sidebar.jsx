import React, { Component } from "react";
import { Tooltip } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";

const Sidebar = (props) => {
  return (
    <>
      <div className="sidebar" data-background-color="dark">
      <div className="sidebar-logo">
          <div className="logo-header" data-background-color="dark">
            <div className="col-sm-3 col-md-3 mt-5 mb-2 ms-sm-0">
              <Tooltip
                title={
                  <small>
                    {[
                      `Name: ${sessionStorage.getItem("USER_DISPLAY_NAME")}`,                      
                      <br />,
                      `Email: ${sessionStorage.getItem("USER_EMAIL")}`,
                      <br />,
                      `Role: ${sessionStorage.getItem("USER_ROLE")}`,
                    ]}
                  </small>
                }
                placement="bottom-end"
                arrow
              >
                <img
                  src={sessionStorage.getItem("USER_PROFILE_IMAGE") || "/assets/img/dummy-profile-pic.jpg"}
                  alt="..."
                  className="avatar-img rounded-circle"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </Tooltip>
            </div>
            <div className="header-username mt-5 mb-2 ps-1 ms-sm-0">
              { sessionStorage.getItem("USER_DISPLAY_NAME") }
            </div>
            {/* <div className="col-sm-3 col-md-3 mt-5 mb-2 ms-sm-0">
              <img
                src="/assets/img/dummy-profile-pic.jpg"
                alt="..."
                className="avatar-img rounded-circle"
              />
            </div>
            <div className="header-username mt-5 mb-2 ps-1 ms-sm-0">
              {sessionStorage.getItem("displayName")}
            </div> */}
          </div>
        </div>
        <div className="sidebar-wrapper scrollbar scrollbar-inner">
          <div className="sidebar-content">

            <ul className="nav nav-secondary">
              {sessionStorage.getItem('USER_ROLE') === 'superadmin' ? (
                <li className={location.pathname.slice(1) === 'superadmin' ? 'nav-item active' : 'nav-item'}>
                  <a href="/superadmin">
                    <i className="fas fa-shield-alt"></i>
                    <p>Super Admin</p>
                  </a>
                </li>
              ) : (
                <>
                  {(location.pathname.slice(1) == "input") ? (
                    <li className="nav-item active">
                      <a href="/input"><i className="fas fa-desktop"></i><p>Input</p></a>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <a href="/input"><i className="fas fa-desktop"></i><p>Input</p></a>
                    </li>
                  )}
                  {(location.pathname.slice(1) == "configuration") ? (
                    <li className="nav-item active">
                      <a href="/configuration"><i className="fas fa-layer-group"></i><p>Configuration</p></a>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <a href="/configuration"><i className="fas fa-layer-group"></i><p>Configuration</p></a>
                    </li>
                  )}
                </>
              )}
            </ul>

          </div>
        </div>
      </div>
    </>

  );
};

export default Sidebar;