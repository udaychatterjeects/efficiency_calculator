import React, { useEffect, useState, Component } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/common/Login";
import OtherComponents from "./components/common/OtherComponents";


function App() {
  return (

    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPass />} /> */}
        <Route path="/*" element={<OtherComponents />} />
      </Routes>
    </Router>
  );
}

export default App;
