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

  const [email, setEmail] = useState(null);

  // inputs check validity
  const [handleInputEmailIsValid, setHandleInpuEmailIsValid] = useState(false);

  // add CSS className
  const [handleInputEmailClassName, setHandleInputEmailClassName] = useState(null);

  const [buttonSendEmailCodeIsDisabled, setButtonSendEmailCodeIsDisabled] = useState(false);

  /*   useEffect(() => {
      //setEmail(emailParent);
    }, []) */

  // clear/reset inputs, other...
  const clearInputs = () => {
    setEmail(null);
    setHandleInpuEmailIsValid(false);
    setHandleInputEmailClassName(null);
    setButtonSendEmailCodeIsDisabled(false);
  }

  const sendEmailCodeNoReply = async () => {

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
          //setButtonLoginUserIsDisabled(false);
        } else if (res.data.status_code === 2) {
          toast.dismiss(toastNotify);
          toast.error("Invalid email format");
          //setButtonLoginUserIsDisabled(false);
        } else if (res.data.status_code === 4) {
          toast.dismiss(toastNotify);
          toast.error("Account with that email doesn't exist");
          //setButtonLoginUserIsDisabled(false);
        } else if (res.data.status_code === 6) {
          toast.dismiss(toastNotify);
          toast("Email not verified yet");
          //setButtonLoginUserIsDisabled(true);
          //resendEmailCode();
        } else {
          //secureLocalStorage.setItem("token", res.data.token);

          toast.dismiss(toastNotify);

          //window.location.reload();
          clearInputs();
        }
      }

    }).catch(err => {
      console.log(err);
      //setButtonLoginUserIsDisabled(false);
      toast.dismiss(toastNotify);
      toast.error("Error");
      return;
    })

  }

  const recover = async () => {

    //setButtonLoginUserIsDisabled(true);

    const toastNotify = toast.loading("Loading");

    const data = {
      email: email.toLocaleLowerCase(),
      //password: password
    }

    await axios.post(`${url}/account/user/password/recover`, data).then((res) => {

      if (res.status === 200) {

        if (res.data.status_code === 1) {
          toast.dismiss(toastNotify);
          toast.error("Error"); // Error save data to DB
          //setButtonLoginUserIsDisabled(false);
        } else if (res.data.status_code === 2) {
          toast.dismiss(toastNotify);
          toast.error("Invalid email format");
          //setButtonLoginUserIsDisabled(false);
        } else if (res.data.status_code === 4) {
          toast.dismiss(toastNotify);
          toast.error("Account with that email doesn't exist");
          //setButtonLoginUserIsDisabled(false);
        } else if (res.data.status_code === 6) {
          toast.dismiss(toastNotify);
          toast("Email not verified yet");
          //setButtonLoginUserIsDisabled(true);
          //resendEmailCode();
        } else {
          secureLocalStorage.setItem("token", res.data.token);

          toast.dismiss(toastNotify);

          window.location.reload();
          clearInputs();
        }
      }

    }).catch(err => {
      console.log(err);
      //setButtonLoginUserIsDisabled(false);
      toast.dismiss(toastNotify);
      toast.error("Error");
      return;
    })

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


  const pass = () => {
    setEmail(emailParent);
  }
  const test = () => {
    console.log("test email: " + email);
  }

  return (
    <div>

      <div>
        {emailParent ?

          <div className="alert alert-secondary alert-dismissible fade show" role="alert">
            <small className="me-md-2">Use this email: {emailParent} ?</small>
            <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="alert" onClick={pass}>Yes</button>
          </div>

          : <div></div>}  {/* use: <div></div> not: <></> to prevent error: Failed to execute 'removeChild' on 'Node'... when remove emailParent data from login email input */}
          
      </div>
      <form onSubmit={handleSubmit}>

        <div className="form-floating mb-3">
          <input type="email" value={email ? email : ""} className={"form-control " + handleInputEmailClassName} id="floatingInputEmail2" placeholder="Email" onChange={(e) => handleInputEmail(e)} autoComplete="off" required />
          <label htmlFor="floatingInputEmail2">Email *</label>
          <div className="invalid-feedback">
            <small>Email must contain @ and .</small>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!email || buttonSendEmailCodeIsDisabled} onClick={test}>Send Code</button>
      </form>
    </div>
  )
}

export default UserPasswordRecover;