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
    <header className="d-flex justify-content-around navbar fixed-top shadow" style={{ backgroundColor: "#786fa6" }}>
      <div>
        <Link to="/" className="navbar-brand">
          <img src={logo} width="80" alt="my-Post" />
        </Link>
      </div>


      <div class="d-grid gap-2 d-md-flex justify-content-md-end">

        <button class="btn btn-primary btn-sm me-md-2 rounded-pill shadow" type="button">Button {user.fullName} {user.email}</button>

        <div class="dropdown">
          <button class="btn btn-secondary btn-sm dropdown-toggle rounded-pill shadow" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown button
          </button>
          <ul class="dropdown-menu shadow-lg">
          <li><NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink></li>
            <li><button type="button" className="dropdown-item btn btn-danger btn-sm rounded-pill shadow" onClick={logout}>Logout</button></li>
          </ul>
        </div>



      </div>





    </header>
  )
}

export default Header;