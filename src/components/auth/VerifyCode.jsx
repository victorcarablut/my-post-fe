import { useEffect, useState } from "react";

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url_twitter } from "../../config.js";

import { useLocation, useNavigate } from "react-router-dom";

import PrivateRoute from '../security/PrivateRoute.js';
import VerifyToken from '../security/VerifyToken.js';

const VerifyCode = () => {

  const {state} = useLocation();

  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {

    checkAuth(PrivateRoute, VerifyToken);

    console.log("verify code");
    //verifyCode();
  }, []);


  const checkAuth = (privateRoute, verifyToken) => {
    

    //const { email } = state;

    //console.log("email state: " + state?.email);

    if (!state?.email || state?.email === null || state?.email === undefined) {
      console.log("undef....");
      navigate("/");

    } else {

      if (secureLocalStorage.getItem("token")) {
        try {
          if (privateRoute) {
            console.log("privateRoute: ", "true");
            if (verifyToken) {
              console.log("verifyToken: ", "true");
              navigate("/");
            } else {
              console.log("verifyToken: ", "false");
              //setMainLoading(false);
            }
          } else {
            console.log("privateRoute: ", "false");
            //setMainLoading(false);
          }
        } catch (error) {
          // error checkAuth
          console.log("error checkAuth");
        }

      } else {
        //navigate("/code/verify");
        setEmail(state?.email);
        navigate(window.location.pathname, {replace: true});
      }


    }
  }

  const verifyCode = async () => {

    //console.log("email state in: VerifyCode: " + state?.email);
    console.log("email in: VerifyCode: " + email);
    const data = {
      email: email,
      code: code
    }

    await axios.post(`${url_twitter}/account/email/code/verify`, data).then((res) => {
      if (res.status === 200) {
        console.log("code OK");
        navigate("/login")
      } else {
        return;
      }

    }).catch(err => {
      //console.log(err);
      return;
    })

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  return (
    <div>
      Verify Code

      <form onSubmit={handleSubmit}>



        <input
          type="text"
          placeholder='code'
          name='code'
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          required
        />

        <button disabled={!code} onClick={verifyCode}>Verify Code</button>
      </form>

    </div>
  )
}

export default VerifyCode;