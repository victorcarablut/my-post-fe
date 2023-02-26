import React, { useEffect, useState } from 'react';

// Axios (API)
import axios from 'axios';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// config file (URL)
import { url } from "../../config.js";

// Link 
import { Link, useNavigate } from 'react-router-dom';

import { VerifyToken } from '../security/VerifyToken.js';

import { LoadingFullScreen } from '../_resources/ui/Loadings';

// Notifications
import toast from 'react-hot-toast';

import UserPasswordRecover from '../account/UserPasswordRecover.jsx';
import SendEmailCodeNoReplay from '../account/SendEmailCodeNoReplay.jsx';


function Register() {

    const navigate = useNavigate();

    const [mainLoading, setMainLoading] = useState(true);

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordType, setPasswordType] = useState("password");
    const [passwordVisibleChecked, setPasswordVisibleChecked] = useState(false);

    // inputs check validity
    const [handleInputEmailIsValid, setHandleInpuEmailIsValid] = useState(false);

    // add CSS className
    const [handleInputEmailClassName, setHandleInputEmailClassName] = useState(null);

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
        setHandleInputEmailClassName(null);
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
    }

    const handleInputPasswordVisible = async () => {

        setPasswordVisibleChecked(!passwordVisibleChecked);

        if (!passwordVisibleChecked) {
            setPasswordType("text");
        } else {
            setPasswordType("password");
        }

    }

    const checkAllInputsValidity = () => {

        if (handleInputEmailIsValid) {
            setHandleInputEmailClassName("is-valid")
        } else {
            setHandleInputEmailClassName("is-invalid")
        }

    }

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
    }

    const resendEmailCode = async () => {
        setButtonLoginUserIsDisabled(true);
        const toastNotify = toast.loading("Loading... resend code");

        const data = {
            email: email.toLocaleLowerCase()
        }

        await axios.post(`${url}/account/email/code/send`, data).then((res) => {

            if (res.status === 200) {

                toast.dismiss(toastNotify);
                toast.success("Code sent successfully");

                navigate(
                    "/code/verify",
                    {
                        state: {
                            email: email
                        }
                    }
                )

                clearInputs();
            }

        }).catch(err => {
            console.log(err);
            setButtonLoginUserIsDisabled(false);
            toast.dismiss(toastNotify);
            toast.error("Error resend code");
            return;
        })
    }

    const loginUser = async () => {

        checkAllInputsValidity();

        if (handleInputEmailIsValid) {

            setButtonLoginUserIsDisabled(true);
            setPasswordType("password");
            const toastNotify = toast.loading("Loading");

            const data = {
                email: email.toLocaleLowerCase(),
                password: password
            }

            await axios.post(`${url}/account/user/login`, data).then((res) => {

                if (res.status === 200) {

                    if (res.data.status_code === 2) {
                        toast.dismiss(toastNotify);
                        toast.error("Invalid email format");
                        setButtonLoginUserIsDisabled(false);
                    } else if (res.data.status_code === 4) {
                        toast.dismiss(toastNotify);
                        toast.error("User with that email not found");
                        setButtonLoginUserIsDisabled(false);
                    } else if (res.data.status_code === 6) {
                        toast.dismiss(toastNotify);
                        toast("Email not verified yet");
                        setButtonLoginUserIsDisabled(true);
                        resendEmailCode();
                    } else {
                        secureLocalStorage.setItem("token", res.data.token);

                        toast.dismiss(toastNotify);

                        window.location.reload();
                        clearInputs();
                    }
                }

            }).catch(err => {
                console.log(err);
                setButtonLoginUserIsDisabled(false);
                toast.dismiss(toastNotify);
                toast.error("Error");
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
                                            <input type={passwordType} className="form-control" id="floatingInputPassword" placeholder="Password" onChange={(e) => handleInputPassword(e)} autoComplete="off" required />
                                            <label htmlFor="floatingInputPassword">Password *</label>
                                        </div>
                                        <div className="mb-3">
                                            <input type="checkbox" className="form-check-input me-md-2" id="checkPasswordVisible" defaultChecked={passwordVisibleChecked} onChange={() => handleInputPasswordVisible()} />
                                            <label className="form-check-label" htmlFor="checkPasswordVisible"><small>Show Password</small></label>
                                        </div>

                                        <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!email || !password || buttonLoginUserIsDisabled} onClick={loginUser}>Login</button>
                                    </form>

                                    <p><small className="text-muted">All fields marked with an asterisk (*) are required.</small></p>

                                    <button type="button" className="btn btn-outline btn-sm rounded-pill mb-3" data-bs-toggle="modal" data-bs-target="#passwordRecoverModal">Forgot Password?</button>

                                    <div className="alert alert-secondary" role="alert">
                                        <i className="bi bi-info-circle me-2"></i>
                                        <small>By clicking Login you have read and agree to our<Link to="/privacy-policy" type="button" className="btn btn-link btn-sm">Privacy Policy,</Link>including<Link to="/privacy-policy" type="button" className="btn btn-link btn-sm">Cookie Use.</Link></small>
                                    </div>

                                </div>
                                <div className="card-footer text-muted">
                                    <small className="me-2">Don't have an account?</small>
                                    <Link to="/register" type="button" className="btn btn-light btn-sm me-md-2 rounded-pill border border-2">Register</Link>
                                </div>
                            </div>
                        </div>

                        {/* --- Modal (Reset Password) --- */}
                        <div className="modal fade" id="passwordRecoverModal" tabIndex="-1" aria-labelledby="passwordRecoverModalLabel" aria-hidden="true" >
                            <div className="modal-dialog" style={{ maxWidth: 400 }}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="passwordRecoverModalLabel">Recover Password</h1>
                                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Send code</p>
                                        {/* <SendEmailCodeNoReplay email = {email}  /> */}
                                        <div>
                                            <UserPasswordRecover emailParent={email ? email : ""} />
                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-danger btn-sm rounded-pill shadow">Logout</button>
                                        <button type="button" className="btn btn-secondary btn-sm rounded-pill shadow" id='button-modal-submit-delete-employee-close' data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



            }
        </>

    )
}

export default Register;