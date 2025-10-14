import React, { useEffect, useState, Component } from "react";
import { apiQuery, apiRoute } from '../../api/apiClient';
import { Link,useNavigate } from 'react-router-dom'
import { useAuth } from "../../Context/AuthContext";
import ButtonMailto from "./ButtonMailto";


const Login = (props) => {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authUser, setAuthUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const navigate = useNavigate()

  const handleSetEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };
  function handleLogin() {
    let body = {
      email: email,
      password: password,
    };

    if (
      email !== null &&
      password !== null

    ) {
      var x = apiQuery({
        ...apiRoute.Identity.LogIn,
        body: body,
      }).then(response => {
        if (response.data.success === true) {
          setIsLoggedIn(true)
          sessionStorage.setItem("USER_DISPLAY_NAME", response.data.displayName)
          sessionStorage.setItem("USER_EMAIL", response.data.email)
          sessionStorage.setItem("USER_ROLE", response.data.role)
          sessionStorage.setItem("USER_ACCESS_TOKEN", response.data.token)
          navigate('/input');
        }
        else {
          alert(response.data.message)
        }
      })
        .catch(error => {
          alert(error.data.message);

        });
    }

    // Close the modal
    setOpen(false);

  }

  useEffect(() => {
    if (sessionStorage.getItem("USER_ACCESS_TOKEN") != null) {
      navigate('/input');
    }
  }, []);
  return (
    <>
      <div className="d-flex w-100">
        <div className="container d-flex vh-100">
          <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-table h-100">
            <div className="d-table-cell align-middle">
              <div className="text-center mt-4">
                <h1 className="h2">Cognizant Framework for GenAI induced Efficiency Calculation</h1>
                <p className="lead">Sign in to your account to continue</p>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="m-sm-3">
                    {/* Form */}
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          placeholder="Email"
                          onChange={handleSetEmail}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          onChange={handleSetPassword}
                          className="form-control"
                          type="password"
                          name="password"
                          placeholder="Password"
                        />
                      </div>

                      {/* <div className="align-items-center">
                        <label className="text-small">
                          <a href="/forget-password">Forgot Password ?</a>
                        </label>
                      </div> */}
                      {/* Button */}
                      <div className="d-grid gap-2 mt-3">
                        <button
                          type="button"
                          className="btn btn-primary btn-lg btn-round"
                          onClick={handleLogin}
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-3">
                Don't have an account ? <ButtonMailto label="Contact Us" mailto="mailto:INSQEAGENAICommunity@cognizant.com" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default Login;