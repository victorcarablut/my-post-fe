import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url_twitter } from "../../config.js";

import { useNavigate } from "react-router-dom";

import PrivateRoute from '../security/PrivateRoute.js';
import VerifyToken from '../security/VerifyToken.js';

function Login() {

    const navigate = useNavigate();
    //const location = useLocation();
    //const from = location.state?.from?.pathname || "/";

    const [mainLoading, setMainLoading] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    useEffect(() => {

        checkAuth(PrivateRoute, VerifyToken);

    }, []);

    /* 
    if access to .../login check if already exists token and if it is a valid token, 
    if yes: auto redirect to .../ (home) | info: logout first if user wants to login again
    if not: stay in .../login
    */
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
            navigate(window.location.pathname, {replace: true});
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log("email: " + email);
        //console.log("password: " + password);
    }

    const login = async () => {

        const config = {
            headers: { 'Content-Type': 'application/json' },
            //withCredentials: true
        }

        const data = {
            email: email,
            password: password
        }

        await axios.post(`${url_twitter}/account/login`, data, config).then((res) => {
            if (res.status === 200) {
                console.log("login OK");
                //console.log(res.data);
                //console.log(res.data.token);
                secureLocalStorage.setItem("token", res.data.token);
                navigate("/");

                // clear input
            }

        }).catch(err => {
            console.log(err);
            return;
        })
    }

    // example
    const goBack = () => navigate(-1);

    return (
        <div>
            Login

            {mainLoading && <h1>Main Loading</h1>}

            <form onSubmit={handleSubmit}>


                <input
                    type="text"
                    placeholder='email'
                    name='email'
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    required
                />

                <input
                    type="password"
                    placeholder='password'
                    name='password'
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    required
                />

                <button disabled={!email || !password} onClick={login}>Login</button>
            </form>

            <button onClick={goBack}>Go Back</button>
        </div>
    )
}

export default Login;