import React from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Input from '../input/Input';
// import Processing from "../pages/Processing";
import Configuration from '../configuration/Configuration';
import SuperAdminDashboard from '../superadmin/SuperAdminDashboard';
import { AuthProvider } from "../../Context/AuthContext";
// import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Routes,
  useLocation
} from "react-router-dom";
// import Footer from "./Footer";

const OtherComponents = () => {
  return (
    <AuthProvider>
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <Header />
          <div className="container">
            <Routes>
              {/* <Route path="/login" element={<Login />} /> */}
              <Route path="/" element={<Input />} />
              <Route path="/input" element={<Input />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/superadmin" element={<SuperAdminDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default OtherComponents;