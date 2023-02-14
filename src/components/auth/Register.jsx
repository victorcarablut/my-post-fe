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
            navigate(window.location.pathname, {replace: true});
        }
    }

    const handleSubmit = async (e) => {
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


    const register = async () => {

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
        <div>
            Register

            {mainLoading && <h1>Main Loading</h1>}

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder='full name'
                    name='fullName'
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="off"
                    required
                />

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

                <button disabled={!fullName || !email || !password} onClick={register}>Register</button>
            </form>
        </div>
    )
}

export default Register