import React, { useEffect, useState } from 'react';

// Axios (API)
import axios from 'axios';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// config file (URL)
import { url } from "../../config.js";

// Link 
import { Link, useNavigate } from 'react-router-dom';

// Notifications
import toast from 'react-hot-toast';

function UserPasswordRecover({ emailParent }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [code, setCode] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordRepeat, setPasswordRepeat] = useState(null);

  const [passwordType, setPasswordType] = useState("password");
  const [passwordVisibleChecked, setPasswordVisibleChecked] = useState(false);

  // inputs check validity
  const [handleInputEmailIsValid, setHandleInpuEmailIsValid] = useState(false);
  const [handleInputCodeIsValid, setHandleInputCodeIsValid] = useState(false);
  const [handleInputPasswordIsValid, setHandleInputPasswordIsValid] = useState(false);
  const [handleInputPasswordRepeatIsValid, setHandleInputPasswordRepeatIsValid] = useState(false);

  // add CSS className
  const [handleInputEmailClassName, setHandleInputEmailClassName] = useState(null);
  const [handleInputCodeClassName, setHandleInputCodeClassName] = useState(null);
  const [handleInputPasswordClassName, setHandleInputPasswordClassName] = useState(null);
  const [handleInputPasswordRepeatClassName, setHandleInputPasswordRepeatClassName] = useState(null);

  const [buttonSendEmailCodeIsDisabled, setButtonSendEmailCodeIsDisabled] = useState(false);
  const [buttonRecoverPasswordIsDisabled, setButtonRecoverPasswordIsDisabled] = useState(false);

  const [emailCodeIsSended, setEmailCodeIsSended] = useState(false);

  // http response status
  //const [responseStatusSendEmailCodeNoReply, setResponseStatusSendEmailCodeNoReply] = useState("");

  /*   useEffect(() => {
      //setEmail(emailParent);
    }, []) */

  // clear/reset inputs, other...
  const clearInputs = () => {
    setEmail(null);
    setCode(null);
    setPassword(null);
    setPasswordRepeat(null);

    setHandleInpuEmailIsValid(false);
    setHandleInputCodeIsValid(false);
    setHandleInputPasswordIsValid(false);
    setHandleInputPasswordRepeatIsValid(false);

    setHandleInputEmailClassName(null);
    setHandleInputCodeClassName(null);
    setHandleInputPasswordClassName(null);
    setHandleInputPasswordRepeatClassName(null);

    setButtonSendEmailCodeIsDisabled(false);
    setButtonRecoverPasswordIsDisabled(false);
    setEmailCodeIsSended(false);
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

  const handleInputCode = async (e) => {

    const code = e.target.value;
    const regex = /^[0-9]*$/;

    setCode(code);

    if (regex.test(code) && code.length === 6) {
      setHandleInputCodeIsValid(true);
    } else if (code.length === 0) {
      setHandleInputCodeClassName(null);
    } else {
      setHandleInputCodeIsValid(false);
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

    if (handleInputEmailIsValid) {
      setHandleInputEmailClassName("is-valid")
    } else {
      setHandleInputEmailClassName("is-invalid")
    }

    if (handleInputCodeIsValid) {
      setHandleInputCodeClassName("is-valid");
    } else {
      setHandleInputCodeClassName("is-invalid");
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


  const passEmailParentToChild = () => {
    setEmail(emailParent);

    if (emailParent.includes('@') && emailParent.includes('.') && emailParent.length > 3) {
      setHandleInpuEmailIsValid(true);
    } else if (emailParent.length === 0) {
      setHandleInputEmailClassName(null)
    } else {
      setHandleInpuEmailIsValid(false);
    }
  }


  const sendEmailCodeNoReply = async () => {

    //checkAllInputsValidity();

    if (handleInputEmailIsValid) {
      setHandleInputEmailClassName("is-valid")

      setButtonSendEmailCodeIsDisabled(true);
      const toastNotify = toast.loading("Loading");

      const data = {
        email: email.toLocaleLowerCase()
      }

      await axios.post(`${url}/account/email/code/send`, data).then((res) => {

        if (res.status === 200) {

          if (res.data.status_code === 1) {
            toast.dismiss(toastNotify);
            toast.error("Error"); // Error save data to DB
            setButtonSendEmailCodeIsDisabled(false);
          } else if (res.data.status_code === 2) {
            toast.dismiss(toastNotify);
            toast.error("Invalid email format");
            setButtonSendEmailCodeIsDisabled(false);
          } else if (res.data.status_code === 4) {
            toast.dismiss(toastNotify);
            toast.error("Account with that email doesn't exist");
            setButtonSendEmailCodeIsDisabled(false);
          } else if (res.data.status_code === 7) {
            toast.dismiss(toastNotify);
            toast("Error while sending email, try again!");
            setButtonSendEmailCodeIsDisabled(false);
            //resendEmailCode();
          } else {
            //secureLocalStorage.setItem("token", res.data.token);

            toast.dismiss(toastNotify);
            toast.success("Email sent successfully");
            setEmailCodeIsSended(true);

            // OK

            //window.location.reload();
            //clearInputs();
          }
        }

      }).catch(err => {
        console.log(err);
        setButtonSendEmailCodeIsDisabled(false);
        setEmailCodeIsSended(false);
        toast.dismiss(toastNotify);
        toast.error("Error");
        return;
      })

    } else {
      setHandleInputEmailClassName("is-invalid")
      return;
    }

  }

  // set new password
  const recoverPassword = async () => {

    checkAllInputsValidity();

    if (handleInputEmailIsValid && handleInputCodeIsValid && handleInputPasswordIsValid && handleInputPasswordRepeatIsValid) {


      if (passwordType === "text") {
        setPasswordType("password");
      }

      if (passwordVisibleChecked) {
        setPasswordVisibleChecked(!passwordVisibleChecked);
      }

      setButtonRecoverPasswordIsDisabled(true);

      const toastNotify = toast.loading("Loading");


      const data = {
        email: email.toLocaleLowerCase(),
        code: code,
        password: password
      }

      await axios.post(`${url}/account/user/password/recover`, data).then((res) => {

        if (res.status === 200) {

          if (res.data.status_code === 1) {
            toast.dismiss(toastNotify);
            toast.error("Error"); // Error save data to DB
            setButtonRecoverPasswordIsDisabled(false);
          } else if (res.data.status_code === 2) {
            toast.dismiss(toastNotify);
            toast.error("Invalid email format");
            setButtonRecoverPasswordIsDisabled(false);
          } else if (res.data.status_code === 4) {
            toast.dismiss(toastNotify);
            toast.error("Account with that email doesn't exist");
            setButtonRecoverPasswordIsDisabled(false);
          } else if (res.data.status_code === 5) {
            toast.dismiss(toastNotify);
            toast.error("Wrong verification code");
            setHandleInputCodeClassName("is-invalid animate__animated animate__shakeX");
            setHandleInputCodeIsValid(false);
            setButtonRecoverPasswordIsDisabled(false);
          } else if (res.data.status_code === 6) {
            toast.dismiss(toastNotify);
            toast.error("Email not verified yet");
            setButtonRecoverPasswordIsDisabled(false);
            //resendEmailCode();
          } else {
            //secureLocalStorage.setItem("token", res.data.token);

            toast.dismiss(toastNotify);
            toast.success("Password reset successfully");

            navigate("/login");

            clearInputs();

            window.location.reload();

            //console.log("password reset ok");

            // OK
            
          }
        }

      }).catch(err => {
        console.log(err);
        setButtonRecoverPasswordIsDisabled(false);
        toast.dismiss(toastNotify);
        toast.error("Error");
        return;
      })

    } else {
      return;
    }

  }

  return (
    <div>


      {!emailCodeIsSended ?

        <>

          {emailParent &&

            <div className="alert alert-secondary alert-dismissible fade show" role="alert">
              <small className="me-md-2">Use this email: {emailParent}?</small>
              <button type="button" className="btn btn-secondary btn-sm" onClick={passEmailParentToChild}>Yes</button>
            </div>
          }
          <form onSubmit={handleSubmit}>
            <small>1. Step - Send verification code on email</small>
            <div className="form-floating mb-3">
              <input type="email" value={email ? email : ""} className={"form-control " + handleInputEmailClassName} id="floatingInputEmail2" placeholder="Email" onChange={(e) => handleInputEmail(e)} disabled={buttonSendEmailCodeIsDisabled} autoComplete="off" required />
              <label htmlFor="floatingInputEmail2">Email *</label>
              <div className="invalid-feedback">
                <small>Email must contain @ and .</small>
              </div>
            </div>

            <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!email || buttonSendEmailCodeIsDisabled} onClick={sendEmailCodeNoReply}>Send Code</button>
          </form>
        </>
        :

        <form onSubmit={handleSubmit}>
          <small>2. Step - Set new password</small>
          <div className="form-floating mb-3">
            <input type="email" value={email ? email : ""} className={"form-control " + handleInputEmailClassName} id="floatingInputEmail2" placeholder="Email" disabled={true} autoComplete="off" />
            <label htmlFor="floatingInputEmail2">Email *</label>
            <div className="invalid-feedback">
              <small>Email must contain @ and .</small>
            </div>
          </div>
          <div className="form-floating mb-3">
            <input type="text" className={"form-control text-center " + handleInputCodeClassName} id="floatingInputCode2" placeholder="Code" onChange={(e) => handleInputCode(e)} autoComplete="off" required />
            <label htmlFor="floatingInputCode2">Code (received on email)</label>
          </div>
          <div className="form-floating mb-3">
            <input type={passwordType} className={"form-control " + handleInputPasswordClassName} id="floatingInputPassword2" placeholder="Password" onChange={(e) => handleInputPassword(e)} autoComplete="off" required />
            <label htmlFor="floatingInputPassword2">Password *</label>
            <div className="invalid-feedback">
              <small>Password must contain at least 6 characters</small>
            </div>
          </div>
          <div className="form-floating mb-3">
            <input type={passwordType} className={"form-control " + handleInputPasswordRepeatClassName} id="floatingInputPasswordRepeat2" placeholder="Password Repeat" onChange={(e) => handleInputPasswordRepeat(e)} autoComplete="off" required />
            <label htmlFor="floatingInputPasswordRepeat2">Password Repeat *</label>
            <div className="invalid-feedback">
              <small>Passwords must match</small>
            </div>
          </div>
          <div className="mb-3">
            <input type="checkbox" className="form-check-input me-md-2" id="checkPasswordVisible2" checked={passwordVisibleChecked} onChange={() => handleInputPasswordVisible()} />
            <label className="form-check-label" htmlFor="checkPasswordVisible2">Show Password</label>
          </div>

          <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!email || !code || !password || !passwordRepeat || buttonRecoverPasswordIsDisabled} onClick={recoverPassword}>Submit</button>
        </form>


      }
    </div>
  )
}

export default UserPasswordRecover;