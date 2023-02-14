import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url_twitter } from "../config.js";

// Link 
import { NavLink, Link, useNavigate } from 'react-router-dom';

// Logo
import logo from '../assets/images/logo.png';

function Header() {

  const navigate = useNavigate();

  const [user, setUser] = useState(
    {
      fullName: "",
      email: ""
    }
  )

  useEffect(() => {

    getUser();

  }, []);

  // TODO: use local storage to get only name, email ...
  const getUser = async () => {

    const jwt_token = secureLocalStorage.getItem("token");

    const config = {
      headers: {
        Authorization: "Bearer " + jwt_token
      }

    }

    await axios.get(`${url_twitter}/account/user/details`, config).then((res) => {
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
    navigate("/login");
    console.log(secureLocalStorage.getItem("token"));
  }





  return (
    <nav className="navbar navbar-dark navbar-expand-lg navbar shadow sticky-top" style={{ backgroundColor: "#786fa6" }}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} width="40" alt="my-Post" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <div className="navbar-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
          </div>
          <span className="navbar-text">
            <p>{user.fullName} | {user.email}</p>
            <button type="button" className="btn btn-danger btn-sm rounded-pill shadow" onClick={logout}>Logout</button>
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Header;