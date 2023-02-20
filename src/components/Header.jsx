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

// Logo / User
import logo from '../assets/images/logo.png';
import user_pic_profile from '../assets/images/user.jpg';

import { LoadingFullScreen } from '../components/_resources/ui/Loadings';

function Header() {

  const navigate = useNavigate();

  const [mainLoading, setMainLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // temp
  const [userFullName] = useState("John Doedoe Tony Clarcklkkk John Cena")

  const [user, setUser] = useState(
    {
      fullName: "",
      email: ""
    }
  )

  useEffect(() => {

    checkAuth();

    //getUser();

  }, []);

  const checkAuth = async () => {


    //const tokenVer = VerifyToken();
    //console.log(tokenVer);

    //testVer();
    //const test = testVer();
    //console.log("test header: " + test);

    const verifyToken = await VerifyToken();

    //console.log("header result verifyToken: " + verifyToken);

    if (verifyToken) {
      //console.log(">> " + true);
      setMainLoading(false);
      setIsAuthenticated(true);
    } else {
      //console.log(">> " + false);
      //navigate("/login");
      setMainLoading(false);
      setIsAuthenticated(false);
    }


    /*    if (verifyToken) {
         //navigate("/");
         setIsAuthenticated(true);
         setMainLoading(false);
         //getUser();
         console.log(">> verifyToken true");
       } else {
         // not authenticated
         console.log(">> verifyToken false");
         setMainLoading(false);
         setIsAuthenticated(false);
       } */


    /*  if (secureLocalStorage.getItem("token")) {
       try {
 
         if (verifyToken) {
           //navigate("/");
           setIsAuthenticated(true);
           setMainLoading(false);
           //getUser();
           console.log(">> verifyToken true");
         } else {
           // not authenticated
           console.log(">> verifyToken false");
           setMainLoading(false);
           setIsAuthenticated(false);
         }
 
       } catch (error) {
         // error checkAuth
         console.log("error checkAuth");
       }
 
     } else {
       setMainLoading(false);
       setIsAuthenticated(false); // false
       //navigate(window.location.pathname, { replace: true });
 
       // not authenticated
     } */
  }

  // TODO: use local storage to get only name, email ...
  const getUser = async () => {

    const jwt_token = secureLocalStorage.getItem("token");

    const config = {
      headers: {
        Authorization: "Bearer " + jwt_token
      }

    }

    await axios.get(`${url}/account/user/details`, config).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        console.log(res.data.fullName);
        setUser({
          fullName: res.data.fullName,
          email: res.data.email
        })
        //setIsValid(true);
      } else {
        //setIsValid(false);
        return;
      }

    }).catch(err => {
      //console.log(err);
      //setIsValid(false);
      return;
    })

  }


  const logout = () => {
    secureLocalStorage.removeItem("token");
    setUser({
      fullName: null,
      email: null
    })
    window.location.reload();
    //console.log(secureLocalStorage.getItem("token"));
  }





  return (
    <>

      {
        mainLoading ? <LoadingFullScreen />

          :


          <header className="d-flex justify-content-around navbar sticky-top">

            <div className="animate__animated animate__zoomIn">
              <Link to="/" className="navbar-brand">
                <img src={logo} width="80" alt="my-Post" />
              </Link>
            </div>


            <div className="d-grid gap-2 d-md-flex justify-content-md-end animate__animated animate__fadeInRight">
              {/* {user.fullName} {user.email} */}
              {isAuthenticated ?

                <Link to="/login" type="button" className={"btn btn-light btn-sm me-md-2 rounded-pill shadow fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")} style={{ paddingLeft: 10, paddingRight: 10 }}><img src={user_pic_profile} width="25" alt="my-Post" className="rounded-circle border border-2 me-md-2" />{userFullName?.length >= 20 ? userFullName.substring(0, 25) + "..." : userFullName}</Link>
                :
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <NavLink to="/login" type="button" className={"navbar-nav-link btn btn-light btn-sm me-md-2 rounded-pill shadow fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")} style={{ paddingLeft: 10, paddingRight: 10 }}>Login</NavLink>
                  <NavLink to="/register" type="button" className={"navbar-nav-link btn btn-light btn-sm me-md-2 rounded-pill shadow fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")} style={{ paddingLeft: 10, paddingRight: 10 }}>Register</NavLink>
                </div>

              }
              {/* <Link to="/login" type="button" class="btn btn-light btn-sm me-md-2 rounded-pill shadow fw-semibold" style={{paddingLeft: 10, paddingRight: 15}}><i class="bi bi-box-arrow-in-right me-md-2"/>Login</Link> */}

              <div className="dropdown">
                <button className="btn btn-light btn-sm dropdown-toggle rounded-pill shadow" type="button" data-bs-toggle="dropdown" aria-expanded="false">

                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                  <li><NavLink to="/" className={"dropdown-item navbar-nav-link fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")}>Posts</NavLink></li>
                  <li><NavLink to="/about" className={"dropdown-item navbar-nav-link fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")}>About</NavLink></li>
                  <li><NavLink to="/contact" className={"dropdown-item navbar-nav-link fw-semibold " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")}>Contact</NavLink></li>
                  {isAuthenticated &&
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button type="button" className={"btn btn-danger btn-sm rounded-pill  fw-semibold shadow " + (({ isActive }) => isActive ? "nav-link active" : "nav-link")} onClick={logout}>Logout</button></li>
                    </>
                  }

                </ul>
              </div>
            </div>
          </header>

      }

    </>
  )
}

export default Header;