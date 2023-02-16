import { useEffect, useState } from "react";

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../../config.js";

// Link 
import { Link, useLocation, useNavigate } from 'react-router-dom';

import PrivateRoute from '../security/PrivateRoute.js';
import VerifyToken from '../security/VerifyToken.js';

// Notifications
import toast from 'react-hot-toast';

const VerifyCode = () => {

  const { state } = useLocation();

  const navigate = useNavigate();

  const [code, setCode] = useState(null);
  const [email, setEmail] = useState("dibakos701@mirtox.com");

  // inputs check validity
  const [handleInputCodeIsValid, setHandleInputCodeIsValid] = useState(false);

  const [handleInputCodeClassName, setHandleInputCodeClassName] = useState(null);

  const [buttonVerifyCodeIsDisabled, setButtonVerifyCodeIsDisabled] = useState(false);

  useEffect(() => {

    //checkAuth(PrivateRoute, VerifyToken);
    //verifyCode();
  }, []);


  const checkAuth = (privateRoute, verifyToken) => {


    //const { email } = state;

    //console.log("email state: " + state?.email);

    if (!state?.email || state?.email === null || state?.email === undefined) {
      console.log("undef....");
      // navigate("/");

      // temporary
      navigate(window.location.pathname, { replace: true });

    } else {

      setEmail(state?.email);

      /* if (secureLocalStorage.getItem("token")) {
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
      } */


    }
  }

  // clear/reset inputs, other...
  const clearInputs = () => {
    setEmail(null);
    setCode(null);
    setHandleInputCodeIsValid(false);
    setHandleInputCodeClassName(null);
    setButtonVerifyCodeIsDisabled(false);
  }



  const handleInputCode = async (e) => {

    const code = e.target.value;
    const regex = /^[0-9]*$/;

    setCode(code);
    console.log(code.length);

    if (regex.test(code) && code.length === 6) {
      setHandleInputCodeIsValid(true);
    } else {
      setHandleInputCodeIsValid(false);
    }
  }


  const checkAllInputsValidity = () => {
    if (handleInputCodeIsValid) {
      setHandleInputCodeClassName("is-valid");
    } else {
      setHandleInputCodeClassName("is-invalid");
    }
  }


  const handleSubmitCode = async (e) => {
    e.preventDefault();
  }

  const verifyCode = async () => {

    checkAllInputsValidity();

    if (handleInputCodeIsValid) {

      setButtonVerifyCodeIsDisabled(true);
      const toastNotify = toast.loading("Loading");

      //console.log("email state in: VerifyCode: " + state?.email);
      //console.log("email in: VerifyCode: " + email);
      const data = {
        email: email,
        code: code
      }

      await axios.post(`${url}/account/email/code/verify`, data).then((res) => {

        if (res.status === 200) {

          if (res.data.status_code === 2) {

            toast.dismiss(toastNotify);
            toast.error("Wrong code");

            setButtonVerifyCodeIsDisabled(false);
            setHandleInputCodeIsValid(false);
            setHandleInputCodeClassName("is-invalid animate__animated animate__shakeX");
          } else {
            navigate("/login")
            clearInputs();
          }

        }
      }).catch(err => {
        console.log("verifyCode7");
        //console.log(err);
        setButtonVerifyCodeIsDisabled(false);
        toast.dismiss(toastNotify);
        toast.error("Server error");
        return;
      })

    } else {
      return;
    }

  }

  return (
    <div className="d-flex justify-content-center">

      <div className="container-fluid" style={{ maxWidth: 400 }}>
        <div className="card text-center shadow-lg animate__animated animate__fadeIn">
          <div className="card-header fw-semibold">
            Verify Code
          </div>
          <div className="card-body">

            <form onSubmit={handleSubmitCode}>
              <div className="form-floating mb-3">
                <input type="text" className={"form-control " + handleInputCodeClassName} id="floatingInputCode" placeholder="Code" onChange={(e) => handleInputCode(e)} autoComplete="off" required />
                <label htmlFor="floatingInputCode">Code</label>
              </div>
              <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!code || buttonVerifyCodeIsDisabled} onClick={verifyCode}>Verify</button>
            </form>

            <p><small className="text-muted mb-3">see email....</small></p>


            <div className="alert alert-secondary" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              <small>By clicking Register you have read and agree to our Privacy Policy, including Cookie Use.</small>
            </div>

          </div>
          <div className="card-footer text-muted">
            <small className="me-2">Already have an account?</small>
            <Link to="/login" type="button" className="btn btn-light btn-sm me-md-2 rounded-pill border border-2 fw-semibold" style={{ paddingLeft: 10, paddingRight: 15 }}><i className="bi bi-box-arrow-in-right me-md-2" />Login</Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default VerifyCode;