import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../config.js";

// Link 
import { NavLink, Link, useNavigate } from 'react-router-dom';

import { VerifyToken } from './security/VerifyToken.js';
import { Logout } from './account/Logout.js';

// Logo / User
import logo from '../assets/images/logo.png';
import default_user_profile_img from '../assets/images/user.jpg';

import { LoadingFullScreen } from '../components/_resources/ui/Loadings';


function Header() {

  //const navigate = useNavigate();

  const [mainLoading, setMainLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(
    {
      fullName: null,
      userProfileImg: null,
      username: null
    }
  )

  /* const [user, setUser] = useState(
    {
      fullName: null,
      email: null
    }
  ) */


  useEffect(() => {

    checkAuth();

  }, []);

  const checkAuth = async () => {

    /*  setInterval(() => {
       checkAuthInfinite();
     }, 5000); */

    const verifyToken = await VerifyToken();

    if (verifyToken) {
      setMainLoading(false);
      setIsAuthenticated(true);
      getUserDetails();

    } else {
      setMainLoading(false);
      setIsAuthenticated(false);
    }

  }

  const checkAuthInfinite = async () => {

    const verifyToken = await VerifyToken();

    if (verifyToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

  }

  const getUserDetails = async () => {

    const jwt_token = secureLocalStorage.getItem("token");

    const config = {
      headers: {
        Authorization: "Bearer " + jwt_token
      }

    }

    await axios.get(`${url}/user/details`, config).then((res) => {
      if (res.status === 200) {
        setUser({
          username: res.data.username,
          fullName: res.data.fullName,
          userProfileImg: res.data.userProfileImg
        })

      } else {
        logout();
      }

    }).catch(err => {
      return;
    })

  }


  const logout = async () => {
    // const logout = await Logout();

    //document.getElementById('button-modal-submit-update-employee-close').click();

    //secureLocalStorage.removeItem("token");
    //setUser({ fullName: null })
    //window.location.reload();

    return await Logout();
  }


  return (
    <>

      {
        mainLoading ? <LoadingFullScreen />

          :


          <header className="d-flex justify-content-around navbar transparent-background-fluid sticky-top mb-5">

            <div className="animate__animated animate__zoomIn">
              <Link to="/" className="navbar-brand">
                <img src={logo} width="80" alt="my-Post" />
              </Link>
            </div>


            <div className="d-grid gap-2 d-md-flex justify-content-md-end animate__animated animate__fadeInRight">

              {isAuthenticated ?

                <Link to={"/user/" + user?.username} type="button" className={"btn btn-light btn-sm me-md-2 rounded-pill shadow fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")} style={{ paddingLeft: 10, paddingRight: 10 }}><img src={user?.userProfileImg ? `data:image/jpg;base64,${user.userProfileImg}` : default_user_profile_img} width="25" height="25" style={{objectFit: "cover"}} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" />{user.fullName?.length >= 20 ? user.fullName.substring(0, 25) + "..." : user.fullName}</Link>
                :
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <NavLink to="/login" type="button" className={"navbar-nav-link btn btn-light btn-sm me-md-2 rounded-pill shadow fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")} style={{ paddingLeft: 10, paddingRight: 10 }}>Login</NavLink>
                  <NavLink to="/register" type="button" className={"navbar-nav-link btn btn-light btn-sm me-md-2 rounded-pill shadow fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")} style={{ paddingLeft: 10, paddingRight: 10 }}>Register</NavLink>
                </div>

              }
              {/* <Link to="/login" type="button" class="btn btn-light btn-sm me-md-2 rounded-pill shadow fw-semibold" style={{paddingLeft: 10, paddingRight: 15}}><i class="bi bi-box-arrow-in-right me-md-2"/>Login</Link> */}

              <div className="dropdown">
                <button className="btn btn-light btn-sm dropdown-toggle rounded-pill shadow" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                  <li><NavLink to="/" className={"dropdown-item navbar-nav-link fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")}>Posts</NavLink></li>
                  <li><NavLink to="/about" className={"dropdown-item navbar-nav-link fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")}>About</NavLink></li>
                  <li><NavLink to="/contact" className={"dropdown-item navbar-nav-link fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")}>Contact</NavLink></li>
                  {isAuthenticated &&
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button type="button" className="btn btn-danger btn-sm rounded-pill fw-semibold shadow" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal">Logout</button></li>
                    </>
                  }

                </ul>
              </div>
            </div>
          </header>

      }

      {/* --- Modal (Delete Employee) --- */}
      <div className="modal fade" id="deleteEmployeeModal" tabIndex="-1" aria-labelledby="deleteEmployeeModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteEmployeeModalLabel">Delete Employee</h1>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger btn-sm rounded-pill shadow" onClick={logout}>Logout</button>
              <button type="button" className="btn btn-secondary btn-sm rounded-pill shadow" id='button-modal-submit-delete-employee-close' data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Header;