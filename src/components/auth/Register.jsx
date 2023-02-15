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

    const REGEX = /^[a-zA-Z0-9]$/;

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
            navigate(window.location.pathname, { replace: true });
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

        const data = {
            fullName: fullName,
            email: email,
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
            }

        }).catch(err => {
            console.log(err);
            return;
        })
    }

    return (


        <div className="d-flex justify-content-center">

            <div className="container-fluid" style={{ maxWidth: 400 }}>
                <div className="card text-center shadow-lg animate__animated animate__fadeIn">
                    <div className="card-header">
                        <i className="bi bi-person-fill me-md-2" />
                        Register
                    </div>
                    <div className="card-body">

                        {mainLoading && <h1>Main Loading</h1>}


                        <form onSubmit={handleSubmitRegister}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInputFullName" placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} autoComplete="off" required />
                                <label for="floatingInputFullName">Full Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInputEmail" placeholder="Email" onChange={(e) => setEmail(e.target.value)} autoComplete="off" required />
                                <label for="floatingInputEmail">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingInputPassword" placeholder="Password" onChange={(e) => setPassword(e.target.value)} autoComplete="off" required />
                                <label for="floatingInputPassword">Password</label>
                            </div>
                            <div className="form-floating">
                                <input type="password" className="form-control" id="floatingInputPasswordRepeat" placeholder="Password Repeat" onChange={(e) => setPasswordRepeat(e.target.value)} autoComplete="off" required />
                                <label for="floatingInputPasswordRepeat">Password Repeat</label>
                            </div>

                            <button disabled={!fullName || !email || !password || !passwordRepeat} onClick={registerUser}>Register</button>
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