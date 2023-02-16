import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from 'axios';

// config file (URL)
import { url_twitter } from "../../config.js";

// Link 
import { NavLink, Link, useNavigate } from 'react-router-dom';

import PrivateRoute from '../security/PrivateRoute.js';
import VerifyToken from '../security/VerifyToken.js';

// ui resources
import { Error, Success } from '../_resources/ui/Alerts.jsx';
import { SmallLoading } from '../_resources/ui/Loadings.jsx';

// Notifications
import toast from 'react-hot-toast';


function Register() {

    const navigate = useNavigate();

    const [mainLoading, setMainLoading] = useState(true);

    const [fullName, setFullName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null)
    const [passwordRepeat, setPasswordRepeat] = useState(null)


    // inputs check validity
    const [handleInputFullNameIsValid, setHandleInputFullNameIsValid] = useState(false);
    const [handleInputEmailIsValid, setHandleInpuEmailIsValid] = useState(false);
    const [handleInputPasswordIsValid, setHandleInputPasswordIsValid] = useState(false);
    const [handleInputPasswordRepeatIsValid, setHandleInputPasswordRepeatIsValid] = useState(false);

    // http response status
    //const [responseStatusRegisterUser, setResponseStatusRegisterUser] = useState(null);

    const [buttonRegisterUserIsDisabled, setButtonRegisterUserIsDisabled] = useState(false);

    useEffect(() => {
        checkAuth(PrivateRoute, VerifyToken);
    }, [])

    const checkAuth = (privateRoute, verifyToken) => {

        if (secureLocalStorage.getItem("token")) {
            try {
                if (privateRoute) {
                    console.log("privateRoute: ", "true");
                    if (verifyToken) {
                        console.log("verifyToken: ", "true");
                        navigate("/");
                    } else {
                        console.log("verifyToken: ", "false");
                        setMainLoading(false);
                    }
                } else {
                    console.log("privateRoute: ", "false");
                    setMainLoading(false);
                }
            } catch (error) {
                // error checkAuth
                console.log("error checkAuth");
            }

        } else {
            setMainLoading(false);
            navigate(window.location.pathname, { replace: true });
        }
    }

    // clear/reset inputs, other...
    const clearInputs = () => {
        setFullName(null);
        setEmail(null);
        setPassword(null);
        setPasswordRepeat(null);
        setHandleInputFullNameIsValid(false);
        setHandleInpuEmailIsValid(false);
        setHandleInputPasswordIsValid(false);
        setHandleInputPasswordRepeatIsValid(false);
        //setResponseStatusRegisterUser(null);
        setButtonRegisterUserIsDisabled(false);
    }

    // handle inputs control

    const handleInputFullName = async (e) => {

        const fullName = e.target.value;
        const regex = /^(?![\s-])[a-zA-Z\s]*$/;

        setFullName(e.target.value);

        if (regex.test(fullName) && fullName.length > 2) {
            setHandleInputFullNameIsValid(true);
        } else {
            setHandleInputFullNameIsValid(false);
        }
    }

    const handleInputEmail = async (e) => {

        const email = e.target.value;
        //const regex = /^[\s])*$/;

        setEmail(e.target.value);

        if (email.includes('@') && email.includes('.') && email.length > 3) {

            setHandleInpuEmailIsValid(true);
        } else {
            setHandleInpuEmailIsValid(false);
        }
    }

    const handleInputPassword = async (e) => {

        const password = e.target.value;
        //const regex = /^[\s])*$/;

        setPassword(e.target.value);

        if (password.length > 5) {
            setHandleInputPasswordIsValid(true);
        } else {
            setHandleInputPasswordIsValid(false);
        }
    }

    const handleInputPasswordRepeat = async (e) => {

        const passwordRepeat = e.target.value;

        setPasswordRepeat(e.target.value);

        console.log("pass repeat: " + passwordRepeat);

        if (passwordRepeat.length > 5 && passwordRepeat === password) {

            setHandleInputPasswordRepeatIsValid(true);
        } else {
            setHandleInputPasswordRepeatIsValid(false);
        }
    }

    const checkAllInputsValidity = () => {
        if (handleInputFullNameIsValid) {
            document.getElementById("floatingInputFullName").classList.add('is-valid');
            document.getElementById("floatingInputFullName").classList.remove('is-invalid');
        } else {
            document.getElementById("floatingInputFullName").classList.add('is-invalid');
            document.getElementById("floatingInputFullName").classList.remove('is-valid');
        }

        if (handleInputEmailIsValid) {
            document.getElementById("floatingInputEmail").classList.add('is-valid');
            document.getElementById("floatingInputEmail").classList.remove('is-invalid');
        } else {
            document.getElementById("floatingInputEmail").classList.add('is-invalid');
            document.getElementById("floatingInputEmail").classList.remove('is-valid');
        }

        if (handleInputPasswordIsValid) {
            document.getElementById("floatingInputPassword").classList.add('is-valid');
            document.getElementById("floatingInputPassword").classList.remove('is-invalid');
        } else {
            document.getElementById("floatingInputPassword").classList.add('is-invalid');
            document.getElementById("floatingInputPassword").classList.remove('is-valid');
        }

        if (handleInputPasswordRepeatIsValid) {
            document.getElementById("floatingInputPasswordRepeat").classList.add('is-valid');
            document.getElementById("floatingInputPasswordRepeat").classList.remove('is-invalid');
        } else {
            document.getElementById("floatingInputPasswordRepeat").classList.add('is-invalid');
            document.getElementById("floatingInputPasswordRepeat").classList.remove('is-valid');
        }
    }

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        console.log("fullName: " + fullName);
        console.log("email: " + email);
        console.log("password: " + password);
    }

    const register1 = () => {
        navigate(
            "/code/verify",
            {
                state: {
                    email: email
                }
            }
        )

    }



    const registerUser = async () => {

        checkAllInputsValidity();

        if (handleInputFullNameIsValid && handleInputEmailIsValid && handleInputPasswordIsValid && handleInputPasswordRepeatIsValid) {

            //setResponseStatusRegisterUser("loading");
            setButtonRegisterUserIsDisabled(true);
            const toastNotify = toast.loading("Loading");

            const data = {
                fullName: fullName,
                email: email.toLocaleLowerCase(),
                password: password
            }

            await axios.post(`${url_twitter}/account/register`, data).then((res) => {
                if (res.status === 200) {
                    //setResponseStatusRegisterUser("success");
                    toast.dismiss(toastNotify);
                    toast.success("Registered successfully");
                    console.log("register OK");
                    //console.log(res.data);
                    //navigate("/code/verify");

                    navigate(
                        "/code/verify",
                        {
                            state: {
                                email: email
                            }
                        }
                    )

                    // clear inputs
                    clearInputs();
                }

            }).catch(err => {
                console.log(err);
                //setResponseStatusRegisterUser("error");
                setButtonRegisterUserIsDisabled(false);
                toast.dismiss(toastNotify);
                toast.error("Server error");
                return;
            })

        } else {
            //checkAllInputsValidity();
            return;
        }


    }

    return (


        <div className="d-flex justify-content-center">

            <div className="container-fluid" style={{ maxWidth: 400 }}>
                <div className="card text-center shadow-lg animate__animated animate__fadeIn">
                    <div className="card-header fw-semibold">
                        <i className="bi bi-person-fill me-2" />
                        User Registration
                    </div>
                    <div className="card-body">

                        {mainLoading && <h1>Main Loading true</h1>}



                        <form onSubmit={handleSubmitRegister}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInputFullName" placeholder="Full Name" onChange={(e) => handleInputFullName(e)} autoComplete="off" required />
                                <label htmlFor="floatingInputFullName">Full Name *</label>
                                <div class="invalid-feedback">
                                    <small>Name must contain only letters</small>
                                </div>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInputEmail" placeholder="Email" onChange={(e) => handleInputEmail(e)} autoComplete="off" required />
                                <label htmlFor="floatingInputEmail">Email *</label>
                                <div class="invalid-feedback">
                                    <small>Email must contain @ and .</small>
                                </div>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingInputPassword" placeholder="Password" onChange={(e) => handleInputPassword(e)} autoComplete="off" required />
                                <label htmlFor="floatingInputPassword">Password *</label>
                                <div class="invalid-feedback">
                                    <small>Password must contain at least 6 characters</small>
                                </div>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingInputPasswordRepeat" placeholder="Password Repeat" onChange={(e) => handleInputPasswordRepeat(e)} autoComplete="off" required />
                                <label htmlFor="floatingInputPasswordRepeat">Password Repeat *</label>
                                <div class="invalid-feedback">
                                    <small>Passwords must match</small>
                                </div>
                            </div>

                            <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!fullName || !email || !password || !passwordRepeat || buttonRegisterUserIsDisabled} onClick={registerUser}>Register</button>
                        </form>

                        <p><small className="text-muted mb-3">All fields marked with an asterisk (*) are required.</small></p>


                        <div class="alert alert-secondary" role="alert">
                            <i class="bi bi-info-circle me-2"></i>
                            <small>By clicking Register you have read and agree to our Privacy Policy, including Cookie Use.</small>
                        </div>



                    </div>
                    <div className="card-footer text-muted">
                        <small className="me-2">Already have an account?</small>
                        <Link to="/login" type="button" class="btn btn-light btn-sm me-md-2 rounded-pill border border-2 fw-semibold" style={{ paddingLeft: 10, paddingRight: 15 }}><i class="bi bi-box-arrow-in-right me-md-2" />Login</Link>
                    </div>
                </div>

            </div>


        </div>
















    )
}

export default Register