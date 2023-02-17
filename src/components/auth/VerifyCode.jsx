import { useEffect, useState } from "react";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../../config.js";

// Link
import { useLocation, useNavigate } from 'react-router-dom';

// Notifications
import toast from 'react-hot-toast';

const VerifyCode = () => {

  const { state } = useLocation();

  const navigate = useNavigate();

  const [code, setCode] = useState(null);
  const [email, setEmail] = useState(null);

  // inputs check validity
  const [handleInputCodeIsValid, setHandleInputCodeIsValid] = useState(false);

  // add CSS className
  const [handleInputCodeClassName, setHandleInputCodeClassName] = useState(null);

  const [buttonVerifyCodeIsDisabled, setButtonVerifyCodeIsDisabled] = useState(false);

  useEffect(() => {

    checkAuth();
  }, []);


  const checkAuth = () => {

    if (!state?.email || state?.email === null || state?.email === undefined) {
      navigate("/");
    } else {
      setEmail(state?.email);
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
    } else if (code.length === 0) {
      setHandleInputCodeClassName(null);
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
            toast.dismiss(toastNotify);
            toast.success("Code verified");
            navigate("/login")
            clearInputs();
          }

        }
      }).catch(err => {
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


  const resendCode = async () => {

    setButtonVerifyCodeIsDisabled(true);
    const toastNotify = toast.loading("Loading");

    const data = {
      email: email,
    }

    await axios.post(`${url}/account/email/code/send`, data).then((res) => {

      if (res.status === 200) {

        if (res.data.status_code === 2) {
          toast.dismiss(toastNotify);
          toast.error("Invalid email format");

          setButtonVerifyCodeIsDisabled(false);

        } else if (res.data.status_code === 4) {

          toast.dismiss(toastNotify);
          toast.error("No user found with that email");

          setButtonVerifyCodeIsDisabled(false);

        } else {
          toast.dismiss(toastNotify);
          toast.success("Code sent on email");
          //clearInputs();
          // custom clear
          setCode(null);
          setHandleInputCodeIsValid(false);
          setHandleInputCodeClassName(null);
          setButtonVerifyCodeIsDisabled(false);
        }

      }
    }).catch(err => {
      //console.log(err);
      setButtonVerifyCodeIsDisabled(false);
      toast.dismiss(toastNotify);
      toast.error("Server error");
      return;
    })



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
                <input type="text" className={"form-control text-center " + handleInputCodeClassName} id="floatingInputCode" placeholder="Code" onChange={(e) => handleInputCode(e)} autoComplete="off" required />
                <label htmlFor="floatingInputCode">Code</label>
              </div>
              <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!code || buttonVerifyCodeIsDisabled} onClick={verifyCode}>Verify</button>
            </form>

            <p><small className="text-muted mb-3">An email with a verification code was sent to: {email?.substring(0, 5) + "**********"}</small></p>

          </div>
          <div className="card-footer text-muted">
            <div className="animate__animated animate__fadeIn animate__delay-5s">
              <small className="me-2">Haven't received any code yet?</small>
              <button className="btn btn-light btn-sm me-md-2 rounded-pill border border-2" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={buttonVerifyCodeIsDisabled} onClick={resendCode}>Resend</button>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default VerifyCode;