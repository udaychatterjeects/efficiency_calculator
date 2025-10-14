import React from 'react';
import { useNavigate } from 'react-router-dom'


const Header = () => {
  const navigate = useNavigate()

  const LogOut = () => {
    sessionStorage.removeItem("USER_ACCESS_TOKEN"); 
    sessionStorage.removeItem("USER_DISPLAY_NAME"); 
    sessionStorage.removeItem("USER_EMAIL"); 
    sessionStorage.removeItem("USER_ROLE"); 
    navigate('/login', { replace: true });
    // swalShower(
    //   'Warning',
    //   'You are about to logout',
    //   'info',
    //   'Are you sure?'
    // ).then(willRedirect => {
    // if (willRedirect) {
    //   authContext.dispatch({
    //     type: 'SIGN_OUT_SUCCESS',
    //     payload: {
    //       displayName: '',
    //       email: '',
    //       photoURL: null,
    //       role: '',
    //       token: '',
    //       userName: 'Guest user',
    //       isAuthenticated: false,
    //       isAdmin: false
    //     }
    //   });
    //   navigate('/login', { replace: true });
    // }
    // });
  };
  return (
    <div className="main-header">
      <div className="main-header-logo">
        <div className="logo-header" data-background-color="dark">
          <div className="nav-toggle">
            <button className="btn btn-toggle toggle-sidebar">
              <i className="gg-menu-right"></i>
            </button>
            <button className="btn btn-toggle sidenav-toggler">
              <i className="gg-menu-left"></i>
            </button>
          </div>
          <button className="topbar-toggler more">
            <i className="gg-more-vertical-alt"></i>
          </button>
        </div>
      </div>
      <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
        <div className="container-fluid">
          <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex">
            <div>
              <span className="h2">Cognizant Framework for GenAI induced Efficiency Calculation</span>
            </div>
          </nav>
          <a
                  className="dropdown-toggle profile-pic"
                  href="javascript:void(0)"
                  aria-expanded="false"
                  onClick={LogOut}
                >
          <span className="profile-username" >
          
            <span className="fw-bold"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
            </svg></span>
            
          </span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Header;