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

import posts_preview_img from '../../assets/images/posts-preview-img.png';


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

    const [loginUserStatus, setLoginUserStatus] = useState("");
    const [emailCodeStatus, setEmailCodeStatus] = useState("");

    useEffect(() => {

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
        checkAuth();

    }, [navigate])

    


    // clear/reset inputs, other...
    const clearInputs = () => {
        setEmail(null);
        setPassword(null);
        setHandleInpuEmailIsValid(false);
        setHandleInputEmailClassName(null);
        setButtonLoginUserIsDisabled(false);
        setLoginUserStatus("");
        setEmailCodeStatus("");
    }

    // handle inputs control

    const handleInputEmail = async (e) => {

        const email = e.target.value;

        setEmail(email);

        if (email.includes('@') && email.includes('.') && email.length > 3) {
            setHandleInpuEmailIsValid(true);
        } else if (email.length === 0) {
            setHandleInputEmailClassName(null);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
    }


    const loginUser = async () => {

        checkAllInputsValidity();

        if (handleInputEmailIsValid) {

            setButtonLoginUserIsDisabled(true);

            if (passwordType === "text") {
                setPasswordType("password");
            }

            if (passwordVisibleChecked) {
                setPasswordVisibleChecked(!passwordVisibleChecked);
            }

            setLoginUserStatus("loading");
            const toastNotify = toast.loading("Loading");

            const data = {
                email: email.toLocaleLowerCase(),
                password: password
            }

            await axios.post(`${url}/account/login`, data).then((res) => {

                if (res.status === 200) {

                    if (res.data.status_code === 2) {
                        toast.dismiss(toastNotify);
                        toast.error("Invalid email format");
                        setButtonLoginUserIsDisabled(false);

                    } else if (res.data.status_code === 4) {
                        toast.dismiss(toastNotify);
                        toast.error("User with that email not found");
                        setLoginUserStatus("user_email_not_found");
                        setButtonLoginUserIsDisabled(false);

                    } else if (res.data.status_code === 6) {
                        toast.dismiss(toastNotify);
                        toast.error("Email not verified yet");
                        setButtonLoginUserIsDisabled(false);
                        setLoginUserStatus("email_not_verified");

                    } else if (res.data.status_code === 9) {
                        toast.dismiss(toastNotify);
                        toast.error("Wrong email or password");
                        setButtonLoginUserIsDisabled(false);

                    } else if (res.data.status_code === 12) {
                        toast.dismiss(toastNotify);
                        toast.error("Account is blocked because rules were violated.");
                        setButtonLoginUserIsDisabled(false);
                        
                    } else {
                        secureLocalStorage.setItem("token", res.data.token);
                        toast.dismiss(toastNotify);
                        setLoginUserStatus("success");

                        window.location.reload();
                        clearInputs();
                    }
                }

            }).catch(err => {
                setButtonLoginUserIsDisabled(false);
                toast.dismiss(toastNotify);
                toast.error("Error");
                setLoginUserStatus("error");
                return;
            })

        } else {
            return;
        }

    }

    const sendEmailCodeNoReply = async () => {

        checkAllInputsValidity();

        if (handleInputEmailIsValid) {

            setEmailCodeStatus("loading")
            const toastNotify = toast.loading("Send Email Code");

            const data = {
                email: email.toLocaleLowerCase()
            }

            await axios.post(`${url}/account/email/code/send`, data).then((res) => {

                if (res.status === 200) {

                    if (res.data.status_code === 1) {
                        toast.dismiss(toastNotify);
                        toast.error("Error"); // Error save data to DB
                        setEmailCodeStatus("error");

                    } else if (res.data.status_code === 2) {
                        toast.dismiss(toastNotify);
                        toast.error("Invalid email format");
                        setEmailCodeStatus("error");

                    } else if (res.data.status_code === 4) {
                        toast.dismiss(toastNotify);
                        toast.error("Account with that email doesn't exist");
                        setEmailCodeStatus("error");

                    } else if (res.data.status_code === 7) {
                        toast.dismiss(toastNotify);
                        toast.error("Error while sending email, try again!");
                        setEmailCodeStatus("error");

                    } else {
                        toast.dismiss(toastNotify);
                        toast.success("Email sent successfully");
                        setEmailCodeStatus("success");

                        navigate(
                            "/code/verify",
                            {
                                state: {
                                    email: email.toLocaleLowerCase()
                                }
                            }
                        )
                        clearInputs();
                    }
                }

            }).catch(err => {
                toast.dismiss(toastNotify);
                toast.error("Error Send Email");
                setEmailCodeStatus("error");
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

                        <div className="container-fluid">

                            <div className="d-grid gap-2 d-md-flex justify-content-md-center">

                                <div className="card bg-transparent border-0 animate__animated animate__fadeIn animate__slower" style={{ maxWidth: 700 }}>
                                    <img src={posts_preview_img} width="100%" height="auto" alt="cover-img" className="card-img-top" style={{ objectFit: "cover" }} />
                                    <div className="card-body">
                                        <h5 className="card-title">myPost</h5>
                                        <p className="card-text">Web App developed for demonstration purposes only.</p>
                                        <p className="card-text"><small>Feel free to register and test the application, personal data such as email will not be shared externally. You can use: <a className="footer-url" href="https://temp-mail.org" target="_blank" rel="noreferrer"><small>temp-mail.org</small></a> as a temporary email.</small></p>
                                        <Link to="/about" type="button" className="btn btn-light rounded-pill btn-sm shadow">Read More</Link>
                                    </div>
                                </div>

                                <div className="card text-center shadow-lg animate__animated animate__fadeIn" style={{ maxWidth: 400, maxHeight: 500 }}>
                                    <div className="card-header fw-semibold">
                                        <i className="bi bi-person-fill me-2" />
                                        User Login
                                    </div>
                                    <div className="card-body">

                                        <form onSubmit={handleSubmit}>

                                            <div className="form-floating mb-3">
                                                <input type="email" className={"form-control " + handleInputEmailClassName} id="floatingInputEmail" placeholder="Email" maxLength="100" onChange={(e) => handleInputEmail(e)} autoComplete="on" required />
                                                <label htmlFor="floatingInputEmail">Email *</label>
                                                <div className="invalid-feedback">
                                                    <small>Email must contain @ and .</small>
                                                </div>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input type={passwordType} className="form-control" id="floatingInputPassword" placeholder="Password" maxLength="100" onChange={(e) => handleInputPassword(e)} autoComplete="off" required />
                                                <label htmlFor="floatingInputPassword">Password *</label>
                                            </div>
                                            <div className="mb-3">
                                                <input type="checkbox" className="form-check-input me-md-2" id="checkPasswordVisible" checked={passwordVisibleChecked} onChange={() => handleInputPasswordVisible()} />
                                                <label className="form-check-label" htmlFor="checkPasswordVisible"><small>Show Password</small></label>
                                            </div>

                                            <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!email || !password || buttonLoginUserIsDisabled} onClick={loginUser}>Login</button>
                                        </form>

                                        <p><small className="text-muted">All fields marked with an asterisk (*) are required.</small></p>





                                        {loginUserStatus === "email_not_verified" &&
                                            <div className="alert alert-warning" role="alert">
                                                <p><small>{email ? email : ""}</small></p>
                                                <p><small className="text-secondary mb-3">Send verification code on email?</small></p>
                                                <div>
                                                    <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!email || emailCodeStatus === "loading"} onClick={sendEmailCodeNoReply}>Send Code</button>
                                                </div>
                                            </div>

                                        }

                                        {loginUserStatus !== "user_email_not_found" && loginUserStatus !== "email_not_verified" && loginUserStatus !== "" &&
                                            <button type="button" className="btn btn-outline btn-sm rounded-pill mb-3" data-bs-toggle="modal" data-bs-target="#passwordRecoverModal">Forgot Password?</button>
                                        }

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
                        </div>

                        {/* --- Modal (Reset Password) --- */}
                        <div className="modal fade" id="passwordRecoverModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="passwordRecoverModalLabel" aria-hidden="true" >
                            <div className="modal-dialog" style={{ maxWidth: 400 }}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="passwordRecoverModalLabel">Recover Password</h1>
                                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div>
                                            <UserPasswordRecover emailParent={email ? email : ""} />
                                        </div>

                                    </div>
                                    <div className="modal-footer">
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