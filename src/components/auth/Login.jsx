import React, { useEffect, useState } from 'react';

// Axios (API)
import axios from 'axios';

// config file (URL)
import { url } from "../../config.js";

// Link 
import { Link, useNavigate } from 'react-router-dom';

import { VerifyToken } from '../security/VerifyToken.js';

import { LoadingFullScreen } from '../_resources/ui/Loadings';

// Notifications
import toast from 'react-hot-toast';


function Register() {

    const navigate = useNavigate();

    const [mainLoading, setMainLoading] = useState(true);

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null)


    // inputs check validity
    const [handleInputEmailIsValid, setHandleInpuEmailIsValid] = useState(false);
    const [handleInputPasswordIsValid, setHandleInputPasswordIsValid] = useState(false);

    // add CSS className
    const [handleInputEmailClassName, setHandleInputEmailClassName] = useState(null);
    const [handleInputPasswordClassName, setHandleInputPasswordClassName] = useState(null);

    const [buttonLoginUserIsDisabled, setButtonLoginUserIsDisabled] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [])

    /* 
    if access to this page, check if user are already authenticated
    - if yes: auto redirect to (home)
    - if not: stay here
    */
    const checkAuth = async () => {

        const verifyToken = await VerifyToken();

        if (verifyToken) {
            navigate("/");
            setMainLoading(false);
        } else {
            setMainLoading(false);
        }
    }

    // clear/reset inputs, other...
    const clearInputs = () => {
        setEmail(null);
        setPassword(null);
        setHandleInpuEmailIsValid(false);
        setHandleInputPasswordIsValid(false);
        setHandleInputEmailClassName(null);
        setHandleInputPasswordClassName(null);
        setButtonLoginUserIsDisabled(false);
    }

    // handle inputs control

    const handleInputEmail = async (e) => {

        const email = e.target.value;

        setEmail(email);

        if (email.includes('@') && email.includes('.') && email.length > 3) {

            setHandleInpuEmailIsValid(true);
        } else if (email.length === 0) {
            setHandleInputEmailClassName(null)
        } else {
            setHandleInpuEmailIsValid(false);
        }
    }

    const handleInputPassword = async (e) => {

        const password = e.target.value;

        setPassword(password);

        if (password.length > 5) {
            setHandleInputPasswordIsValid(true);
        } else if (password.length === 0) {
            setHandleInputPasswordClassName(null);
        } else {
            setHandleInputPasswordIsValid(false);
        }
    }


    const checkAllInputsValidity = () => {

        if (handleInputEmailIsValid) {
            setHandleInputEmailClassName("is-valid")
        } else {
            setHandleInputEmailClassName("is-invalid")
        }

        if (handleInputPasswordIsValid) {
            setHandleInputPasswordClassName("is-valid")
        } else {
            setHandleInputPasswordClassName("is-invalid")
        }
    }

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
    }


    const loginUser = async () => {

        checkAllInputsValidity();

        if (handleInputEmailIsValid && handleInputPasswordIsValid) {

            setButtonLoginUserIsDisabled(true);
            const toastNotify = toast.loading("Loading");

            const data = {
                email: email.toLocaleLowerCase(),
                password: password
            }

            await axios.post(`${url}/account/login`, data).then((res) => {
                if (res.status === 200) {

                    if (res.data.status_code === 3) {
                        toast.dismiss(toastNotify);
                        toast.error("User with that email already exists");
                    } else {
                        toast.dismiss(toastNotify);
                        toast.success("Registered successfully");

                        navigate("/");
                        clearInputs();
                    }
                }

            }).catch(err => {
                console.log(err);
                setButtonLoginUserIsDisabled(false);
                toast.dismiss(toastNotify);
                toast.error("Server error");
                return;
            })

        } else {
            return;
        }

    }

    return (

        <>
            {
                mainLoading ? <LoadingFullScreen />
                    :
                    <div className="d-flex justify-content-center">

                        <div className="container-fluid" style={{ maxWidth: 400 }}>
                            <div className="card text-center shadow-lg animate__animated animate__fadeIn">
                                <div className="card-header fw-semibold">
                                    <i className="bi bi-person-fill me-2" />
                                    User Login
                                </div>
                                <div className="card-body">

                                    <form onSubmit={handleSubmitLogin}>

                                        <div className="form-floating mb-3">
                                            <input type="email" className={"form-control " + handleInputEmailClassName} id="floatingInputEmail" placeholder="Email" onChange={(e) => handleInputEmail(e)} autoComplete="off" required />
                                            <label htmlFor="floatingInputEmail">Email *</label>
                                            <div className="invalid-feedback">
                                                <small>Email must contain @ and .</small>
                                            </div>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input type="password" className={"form-control " + handleInputPasswordClassName} id="floatingInputPassword" placeholder="Password" onChange={(e) => handleInputPassword(e)} autoComplete="off" required />
                                            <label htmlFor="floatingInputPassword">Password *</label>
                                            <div className="invalid-feedback">
                                                <small>Password must contain at least 6 characters</small>
                                            </div>
                                        </div>

                                        <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!email || !password || buttonLoginUserIsDisabled} onClick={loginUser}>Login</button>
                                    </form>

                                    <p><small className="text-muted mb-3">All fields marked with an asterisk (*) are required.</small></p>


                                    <div className="alert alert-secondary" role="alert">
                                        <i className="bi bi-info-circle me-2"></i>
                                        <small>By clicking Login you have read and agree to our<Link to="/privacy-policy" type="button" className="btn btn-light-outline btn-sm">Privacy Policy,</Link>including<Link to="/privacy-policy" type="button" className="btn btn-light-outline btn-sm">Cookie Use.</Link></small>
                                    </div>

                                </div>
                                <div className="card-footer text-muted">
                                    <small className="me-2">Don't have an account?</small>
                                    <Link to="/register" type="button" className="btn btn-light btn-sm me-md-2 rounded-pill border border-2">Register</Link>
                                </div>
                            </div>
                        </div>
                    </div>


            }
        </>

    )
}

export default Register;