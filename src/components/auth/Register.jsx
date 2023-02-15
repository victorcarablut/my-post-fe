import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from 'axios';

// config file (URL)
import { url_twitter } from "../../config.js";

import { useNavigate } from "react-router-dom";

import PrivateRoute from '../security/PrivateRoute.js';
import VerifyToken from '../security/VerifyToken.js';


function Register() {

    const navigate = useNavigate();

    const [mainLoading, setMainLoading] = useState(true);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')


    // inputs check validity
    const [handleInputFullNameIsValid, setHandleInputFullNameIsValid] = useState(false);
    const [handleInputEmailIsValid, setHandleInpuEmailIsValid] = useState(false);
    const [handleInputPasswordIsValid, setHandleInputPasswordIsValid] = useState(false);
    const [handleInputPasswordRepeatIsValid, setHandleInputPasswordRepeatIsValid] = useState(false);

    // const REGEX = /^[a-zA-Z0-9]$/;

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

            const data = {
                fullName: fullName,
                email: email.toLocaleLowerCase(),
                password: password
            }

            await axios.post(`${url_twitter}/account/register`, data).then((res) => {
                if (res.status === 200) {
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

                    // clear input
                    clearInputs();
                }

            }).catch(err => {
                console.log(err);
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
                    <div className="card-header">
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
                                    Please choose a username.
                                </div>

                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInputEmail" placeholder="Email" onChange={(e) => handleInputEmail(e)} autoComplete="off" required />
                                <label htmlFor="floatingInputEmail">Email *</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingInputPassword" placeholder="Password" onChange={(e) => handleInputPassword(e)} autoComplete="off" required />
                                <label htmlFor="floatingInputPassword">Password *</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingInputPasswordRepeat" placeholder="Password Repeat" onChange={(e) => handleInputPasswordRepeat(e)} autoComplete="off" required />
                                <label htmlFor="floatingInputPasswordRepeat">Password Repeat *</label>
                            </div>

                            <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!fullName || !email || !password || !passwordRepeat} onClick={registerUser}>Register</button>
                        </form>
                    </div>
                    <div className="card-footer text-muted">
                        card footer
                    </div>
                </div>

            </div>


        </div>
















    )
}

export default Register