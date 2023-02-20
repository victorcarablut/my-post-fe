import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../../config.js";

// Link 
import { NavLink, Link, useNavigate } from 'react-router-dom';

//import { VerifyToken } from './security/VerifyToken.js';
import { Logout } from './Logout.js';

// Logo / User
//import logo from '../assets/images/logo.png';
//import user_pic_profile from '../assets/images/user.jpg';

import { LoadingFullScreen, LoadingSmall } from '../../components/_resources/ui/Loadings';
import { Error } from '../_resources/ui/Alerts.jsx';

function UserDetails() {

    const [user, setUser] = useState(
        {
            fullName: null,
            email: null,
            username: null,
            role: null,
            registeredDate: null
        }
    )

    // http response status
    const [responseStatusGeUserDetails, setResponseStatusGetUserDetails] = useState("");

    useEffect(() => {

        //checkAuth();
        getUserDetails();

    }, []);

    const getUserDetails = async () => {

        setResponseStatusGetUserDetails("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        await axios.get(`${url}/account/user/details`, config).then((res) => {
            if (res.status === 200) {
                setResponseStatusGetUserDetails("success");
                setUser({
                    fullName: res.data.fullName,
                    email: res.data.email,
                    username: res.data.username,
                    role: res.data.role,
                    registeredDate: res.data.registeredDate
                })
            }

        }).catch(err => {
            setResponseStatusGetUserDetails("error");
            //Logout();
            return;
        })

    }

    return (
        <div className="d-flex justify-content-center">

            <div className="container-fluid" style={{ maxWidth: 400 }}>
                <div className="card text-center shadow-lg animate__animated animate__fadeIn">
                    <div className="card-header fw-semibold">
                        <i className="bi bi-person-fill me-2" />
                        User Details
                    </div>
                    <div className="card-body">

                        {
                            responseStatusGeUserDetails === "loading" ? <LoadingSmall /> :
                                responseStatusGeUserDetails === "error" ? <Error /> :
                                    responseStatusGeUserDetails === "success" ?

                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item"><strong>Full Name:</strong> {user?.fullName}</li>
                                            <li className="list-group-item"><strong>Email:</strong> {user?.email}</li>
                                            <li className="list-group-item"><strong>Username:</strong> {user?.username}</li>
                                            <li className="list-group-item"><strong>Role:</strong> {user?.role}</li>
                                            <li className="list-group-item"><strong>Registered Date:</strong> {user?.registeredDate}</li>
                                        </ul>

                                        :
                                        <></>
                        }


                    </div>
                    <div className="card-footer text-muted">
                        <small className="me-2">Don't have an account?</small>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDetails;