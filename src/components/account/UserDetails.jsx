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
//import UserPasswordRecover from './UserPasswordRecover.jsx';

// Notifications
import toast from 'react-hot-toast';

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

    const [inputFullName, setInputFullName] = useState(null);
    //const [inputFullNameCountChar, setInputFullNameChar] = useState(null);

    // inputs check validity
    const [handleInputFullNameIsValid, setHandleInpuFullNameIsValid] = useState(false);

    // add CSS className
    const [handleInputFullNameClassName, setHandleInputFullNameClassName] = useState(null);

    const [buttonUpdateUserDetailsIsDisabled, setButtonUpdateUserDetailsIsDisabled] = useState(false);

    // http response status
    const [responseStatusGeUserDetails, setResponseStatusGetUserDetails] = useState("");

    useEffect(() => {

        //checkAuth();
        clearInputs();
        getUserDetails();
    }, []);

    // clear/reset inputs, other...
    const clearInputs = () => {
        // setEmail(null);
        // setPassword(null);
        // setHandleInpuEmailIsValid(false);
        // setHandleInputEmailClassName(null);
        // setButtonLoginUserIsDisabled(false);
        // setLoginUserStatus("");
        // setEmailCodeStatus("");

        setUser(null);
        setInputFullName(null);
    }

    const handleInputFullName = async (e) => {

        const fullName = e.target.value;

        //setInputFullName(fullName);

        //setUser({fullName: fullName})

        //setUser({...user, fullName: fullName});

        setInputFullName(fullName);



        // if (fullName.length > 100) {
        //     setHandleInpuFullNameIsValid(true);
        // } else if (fullName.length === 0) {
        //     setHandleInputFullNameClassName(null);
        // } else {
        //     setHandleInpuFullNameIsValid(false);
        // }
    }

    const getUserDetails = async () => {

        setResponseStatusGetUserDetails("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        await axios.get(`${url}/user/details`, config).then((res) => {

            if (res.status === 200) {
                setResponseStatusGetUserDetails("success");
                setUser({
                    fullName: res.data.fullName,
                    email: res.data.email,
                    username: res.data.username,
                    role: res.data.role,
                    registeredDate: res.data.registeredDate
                })

                setInputFullName(res.data.fullName);

            }

        }).catch(err => {
            setResponseStatusGetUserDetails("error");
            Logout();
            return;
        })

    }

    const updateUserDetails = async () => {

        //checkAllInputsValidity();

        // if (handleInputEmailIsValid) {

        //setButtonLoginUserIsDisabled(true);

        //if (passwordType === "text") {
        //setPasswordType("password");
        // }

        // if (passwordVisibleChecked) {
        //setPasswordVisibleChecked(!passwordVisibleChecked);
        //}

        //setLoginUserStatus("loading");
        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            email: user.email.toLocaleLowerCase(),
            //password: password

            fullName: inputFullName
        }

        await axios.put(`${url}/user/details/update`, data, config).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error");
                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");
                    //setButtonLoginUserIsDisabled(false);
                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("User with that email not found");
                    //setLoginUserStatus("user_email_not_found");
                    //setButtonLoginUserIsDisabled(false);
                } else {
                    //secureLocalStorage.setItem("token", res.data.token);

                    toast.dismiss(toastNotify);

                    //getUserDetails();

                    //setLoginUserStatus("success");

                    window.location.reload(); // to update the value in header
                    //clearInputs();
                }
            }

        }).catch(err => {
            console.log(err);
            //setButtonLoginUserIsDisabled(false);
            toast.dismiss(toastNotify);
            toast.error("Error");
            //setLoginUserStatus("error");
            return;
        })

        //} else {
        //    return;
        //}

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
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
                                                            <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-pencil-square"></i></button>
                                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                <form onSubmit={handleSubmit}>
                                                                    <li className="container-fluid mb-3">
                                                                        <input type="text" className={"form-control form-control-sm " + handleInputFullNameClassName} id="inputFullName" placeholder={inputFullName} value={inputFullName} onChange={(e) => handleInputFullName(e)} autoComplete="off" required />
                                                                        {inputFullName?.length > 0 &&
                                                                            <small className="text-secondary">{inputFullName?.length}/100</small>
                                                                        }

                                                                    </li>
                                                                    <li><button className="btn btn-secondary btn-sm rounded-pill fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }}  onClick={updateUserDetails} disabled={!inputFullName}>Update</button></li>
                                                                </form>
                                                            </ul>
                                                        </div>

                                                    </div>
                                                </li>
                                                <li className="list-group-item"><small><strong>Email:</strong> {user?.email}</small></li>
                                                <li className="list-group-item"><small><strong>Username:</strong> {user?.username}</small></li>
                                                <li className="list-group-item"><small><strong>Role:</strong> {user?.role}</small></li>
                                                <li className="list-group-item"><small><strong>Registered:</strong> {moment(user?.registeredDate).locale(moment_locale).format(moment_format_date_time_long)}</small></li>
                                            </ul>

                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                            Accordion Item #1
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTwo">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                            Accordion Item #2
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingThree">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                            Accordion Item #3
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
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