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

// Date Time Format (moment.js)
import moment from 'moment/min/moment-with-locales';
import { moment_locale, moment_format_date_time_long } from '../_resources/date-time/DateTime.js';
import UserPasswordRecover from './UserPasswordRecover.jsx';

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
            Logout();
            return;
        })

    }

    return (
        <div className="d-flex justify-content-center">

            <div className="container-fluid" style={{ maxWidth: 400 }}>
                <div className="card text-left shadow-lg animate__animated animate__fadeIn">
                    <div className="card-header text-center fw-semibold">
                        <i className="bi bi-person-fill me-2" />
                        User Details
                    </div>
                    <div className="card-body">

                        {
                            responseStatusGeUserDetails === "loading" ? <LoadingSmall /> :
                                responseStatusGeUserDetails === "error" ? <Error /> :
                                    responseStatusGeUserDetails === "success" ?

                                        <>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item">
                                                    <div className="d-grid gap-2 d-md-flex">
                                                    <small className="me-md-2"><strong>Full Name:</strong> {user?.fullName}</small>
                                                        <div className="dropdown">
                                                            <button className="btn btn-light btn-sm dropdown-toggle rounded-pill shadow" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                <li>item1</li>
                                                                <li>item2</li>
                                                            </ul>
                                                        </div>
                                                        
                                                    </div>
                                                </li>
                                                <li className="list-group-item"><small><strong>Email:</strong> {user?.email}</small></li>
                                                <li className="list-group-item"><small><strong>Username:</strong> {user?.username}</small></li>
                                                <li className="list-group-item"><small><strong>Role:</strong> {user?.role}</small></li>
                                                <li className="list-group-item"><small><strong>Registered Date:</strong> {moment(user?.registeredDate).locale(moment_locale).format(moment_format_date_time_long)}</small></li>
                                            </ul>

                                            <div class="accordion" id="accordionExample">
                                                <div class="accordion-item">
                                                    <h2 class="accordion-header" id="headingOne">
                                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                            Accordion Item #1
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                        <div class="accordion-body">
                                                            <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="accordion-item">
                                                    <h2 class="accordion-header" id="headingTwo">
                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                            Accordion Item #2
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div class="accordion-body">
                                                            <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="accordion-item">
                                                    <h2 class="accordion-header" id="headingThree">
                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                            Accordion Item #3
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                        <div class="accordion-body">
                                                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </>


                                        :
                                        <></>
                        }


                    </div>
                    <div className="card-footer text-center text-muted">
                        <small className="me-2">Don't have an account?</small>
                        {/* <UserPasswordRecover /> */}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default UserDetails;