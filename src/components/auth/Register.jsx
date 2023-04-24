import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

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

    const [fullName, setFullName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordRepeat, setPasswordRepeat] = useState(null);

    const [passwordType, setPasswordType] = useState("password");
    const [passwordVisibleChecked, setPasswordVisibleChecked] = useState(false);


    // inputs check validity
    const [handleInputFullNameIsValid, setHandleInputFullNameIsValid] = useState(false);
    const [handleInputEmailIsValid, setHandleInpuEmailIsValid] = useState(false);
    const [handleInputPasswordIsValid, setHandleInputPasswordIsValid] = useState(false);
    const [handleInputPasswordRepeatIsValid, setHandleInputPasswordRepeatIsValid] = useState(false);

    // add CSS className
    const [handleInputFullNameClassName, setHandleInputFullNameClassName] = useState(null);
    const [handleInputEmailClassName, setHandleInputEmailClassName] = useState(null);
    const [handleInputPasswordClassName, setHandleInputPasswordClassName] = useState(null);
    const [handleInputPasswordRepeatClassName, setHandleInputPasswordRepeatClassName] = useState(null);

    const [buttonRegisterUserIsDisabled, setButtonRegisterUserIsDisabled] = useState(false);

    const [userRegiteredStatus, setUserRegiteredStatus] = useState("");
    const [emailCodeStatus, setEmailCodeStatus] = useState("");

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
        setFullName(null);
        setEmail(null);
        setPassword(null);
        setPasswordRepeat(null);

        setHandleInputFullNameIsValid(false);
        setHandleInpuEmailIsValid(false);
        setHandleInputPasswordIsValid(false);
        setHandleInputPasswordRepeatIsValid(false);

        setHandleInputFullNameClassName(null);
        setHandleInputEmailClassName(null);
        setHandleInputPasswordClassName(null);
        setHandleInputPasswordRepeatClassName(null);

        setButtonRegisterUserIsDisabled(false);

        setUserRegiteredStatus("");
        setEmailCodeStatus("");
    }

    // handle inputs control

    const handleInputFullName = async (e) => {

        const fullName = e.target.value;
        const regex = /^(?![\s-])[a-zA-Z\s]*$/;

        setFullName(fullName);

        if (regex.test(fullName) && fullName.length > 2) {
            setHandleInputFullNameIsValid(true);
        } else if (fullName.length === 0) {
            setHandleInputFullNameClassName(null);
        } else {
            setHandleInputFullNameIsValid(false);
        }
    }

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

    const handleInputPasswordRepeat = async (e) => {

        const passwordRepeat = e.target.value;

        setPasswordRepeat(passwordRepeat);

        if (passwordRepeat.length > 5 && passwordRepeat === password) {
            setHandleInputPasswordRepeatIsValid(true);
        } else if (passwordRepeat.length === 0) {
            setHandleInputPasswordRepeatClassName(null);
        } else {
            setHandleInputPasswordRepeatIsValid(false);
        }
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
        if (handleInputFullNameIsValid) {
            setHandleInputFullNameClassName("is-valid");
        } else {
            setHandleInputFullNameClassName("is-invalid");
        }

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

        if (handleInputPasswordRepeatIsValid) {
            setHandleInputPasswordRepeatClassName("is-valid")
        } else {
            setHandleInputPasswordRepeatClassName("is-invalid")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    }


    const registerUser = async () => {

        checkAllInputsValidity();

        if (handleInputFullNameIsValid && handleInputEmailIsValid && handleInputPasswordIsValid && handleInputPasswordRepeatIsValid) {

            setButtonRegisterUserIsDisabled(true);
            setPasswordType("password");
            setUserRegiteredStatus("loading");
            const toastNotify = toast.loading("Register User");

            const data = {
                fullName: fullName,
                email: email.toLocaleLowerCase(),
                password: password
            }

            await axios.post(`${url}/account/register`, data).then((res) => {
                if (res.status === 200) {

                    if (res.data.status_code === 1) {
                        toast.dismiss(toastNotify);
                        toast.error("Error"); // Error save data to DB
                        setButtonRegisterUserIsDisabled(false);
                        setUserRegiteredStatus("error");
                    } else if (res.data.status_code === 2) {
                        toast.dismiss(toastNotify);
                        toast.error("Invalid email format");
                        setButtonRegisterUserIsDisabled(false);
                    } else if (res.data.status_code === 3) {
                        toast.dismiss(toastNotify);
                        toast.error("User with that email already exists");
                        setButtonRegisterUserIsDisabled(false);
                        setUserRegiteredStatus("email_already_exist");
                    } else {
                        toast.dismiss(toastNotify);
                        toast.success("Step 1 - Registered successfully");

                        setUserRegiteredStatus("success");

                        sendEmailCodeNoReply(email);

                        /* navigate(
                            "/code/verify",
                            {
                                state: {
                                    email: email
                                }
                            }
                        ) */

                        // clearInputs();
                    }
                }

            }).catch(err => {
                toast.dismiss(toastNotify);
                toast.error("Error");
                setButtonRegisterUserIsDisabled(false);
                setUserRegiteredStatus("error");
                return;
            })

        } else {
            return;
        }

    }


    const sendEmailCodeNoReply = async (email) => {

        setEmailCodeStatus("loading")
        const toastNotify = toast.loading("Send Email Code");

        const data = {
            email: email.toString().toLocaleLowerCase()
        }

        await axios.post(`${url}/account/email/code/send`, data).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error"); // Error save data to DB
                    setEmailCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");
                    setEmailCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("Account with that email doesn't exist");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else if (res.data.status_code === 7) {
                    toast.dismiss(toastNotify);
                    toast.error("Error while sending email, try again!");
                    setEmailCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                    //resendEmailCode();
                } else {
                    //secureLocalStorage.setItem("token", res.data.token);

                    toast.dismiss(toastNotify);
                    toast.success("Step 2 - Email sent successfully");
                    setEmailCodeStatus("success");

                    navigate(
                        "/code/verify",
                        {
                            state: {
                                email: email.toString().toLocaleLowerCase()
                            }
                        }
                    )

                    // OK

                    //window.location.reload();
                    clearInputs();
                }
            }

        }).catch(err => {
            //setButtonSendEmailCodeIsDisabled(false);
            toast.dismiss(toastNotify);
            toast.error("Error Send Email");
            setEmailCodeStatus("error");
            return;
        })
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
                                    User Registration
                                </div>
                                <div className="card-body">

                                    {userRegiteredStatus === "email_already_exist" ?

                                        <div className="alert alert-warning" role="alert">

                                            <p><small>{email}</small></p>
                                            <p><small>User with that email already exists!</small></p>

                                        </div>

                                        :

                                        emailCodeStatus === "error" ?

                                            <div className="alert alert-danger" role="alert">

                                                <p><small>{email}</small></p>
                                                <p><small>Error send email code, try again!</small></p>
                                                <div>
                                                    <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} onClick={sendEmailCodeNoReply}>Resend Code</button>
                                                </div>

                                            </div>
                                            :

                                            <div>

                                                <form onSubmit={handleSubmit}>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className={"form-control " + handleInputFullNameClassName} id="floatingInputFullName" placeholder="Full Name" maxLength="100" onChange={(e) => handleInputFullName(e)} autoComplete="off" required />
                                                        <label htmlFor="floatingInputFullName">Full Name *</label>
                                                        <div className="invalid-feedback">
                                                            <small>Name must contain only letters</small>
                                                        </div>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="email" className={"form-control " + handleInputEmailClassName} id="floatingInputEmail" placeholder="Email" maxLength="100" onChange={(e) => handleInputEmail(e)} autoComplete="off" required />
                                                        <label htmlFor="floatingInputEmail">Email *</label>
                                                        <div className="invalid-feedback">
                                                            <small>Email must contain @ and .</small>
                                                        </div>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type={passwordType} className={"form-control " + handleInputPasswordClassName} id="floatingInputPassword" placeholder="Password" maxLength="100" onChange={(e) => handleInputPassword(e)} autoComplete="off" required />
                                                        <label htmlFor="floatingInputPassword">Password *</label>
                                                        <div className="invalid-feedback">
                                                            <small>Password must contain at least 6 characters</small>
                                                        </div>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type={passwordType} className={"form-control " + handleInputPasswordRepeatClassName} id="floatingInputPasswordRepeat" placeholder="Password Repeat" maxLength="100" onChange={(e) => handleInputPasswordRepeat(e)} autoComplete="off" required />
                                                        <label htmlFor="floatingInputPasswordRepeat">Password Repeat *</label>
                                                        <div className="invalid-feedback">
                                                            <small>Passwords must match</small>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <input type="checkbox" className="form-check-input me-md-2" id="checkPasswordVisible" defaultChecked={passwordVisibleChecked} onChange={() => handleInputPasswordVisible()} />
                                                        <label className="form-check-label" htmlFor="checkPasswordVisible">Show Password</label>
                                                    </div>

                                                    <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!fullName || !email || !password || !passwordRepeat || buttonRegisterUserIsDisabled} onClick={registerUser}>Register</button>
                                                </form>


                                                <p><small className="text-muted">All fields marked with an asterisk (*) are required.</small></p>

                                                <div className="alert alert-secondary" role="alert">
                                                    <i className="bi bi-info-circle me-2"></i>
                                                    <small>By clicking Register you have read and agree to our<Link to="/privacy-policy" type="button" className="btn btn-link btn-sm">Privacy Policy,</Link>including<Link to="/privacy-policy" type="button" className="btn btn-link btn-sm">Cookie Use.</Link></small>
                                                </div>

                                            </div>

                                    }



                                </div>
                                <div className="card-footer text-muted">
                                    <small className="me-2">Already have an account?</small>
                                    <Link to="/login" type="button" className="btn btn-light btn-sm me-md-2 rounded-pill border border-2">Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>


            }
        </>

    )
}

export default Register;