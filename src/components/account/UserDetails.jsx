import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../../config.js";

// Link 
import { NavLink, Link, useNavigate } from 'react-router-dom';

//import { VerifyToken } from './security/VerifyToken.js';
import { Logout } from './Logout.js';

// Logo / User
//import logo from '../assets/images/logo.png';
//import user_pic_profile from '../assets/images/user.jpg';

import { LoadingFullScreen, LoadingSmall } from '../../components/_resources/ui/Loadings';
import { Error } from '../_resources/ui/Alerts.jsx';

// Date Time Format (moment.js)
import moment from 'moment/min/moment-with-locales';
import { moment_locale, moment_format_date_time_long } from '../_resources/date-time/DateTime.js';
//import UserPasswordRecover from './UserPasswordRecover.jsx';

import default_user_profile_img from '../../assets/images/user.jpg';


// Notifications
import toast from 'react-hot-toast';

function UserDetails() {

    const [user, setUser] = useState(
        {
            fullName: null,
            email: null,
            username: null,
            role: null,
            registeredDate: null,
            userProfileImg: null
        }
    )

    const [password, setPassword] = useState();
    const [code, setCode] = useState();

    // new data
    const [fullNameNew, setFullNameNew] = useState(null);
    const [emailNew, setEmailNew] = useState(null);
    const [usernameNew, setUsernameNew] = useState(null);
    const [passwordNew, setPasswordNew] = useState(null);
    const [passwordRepeatNew, setPasswordRepeatNew] = useState(null);
    const [userProfileImgNew, setUserProfileImgNew] = useState(null);
    const [userProfileImgPreviewNew, setUserProfileImgPreviewNew] = useState(null);

    // http response status
    const [responseStatusGeUserDetails, setResponseStatusGetUserDetails] = useState("");

    const [emailNewCodeStatus, setEmailNewCodeStatus] = useState("");

    useEffect(() => {

        //checkAuth();
        clearInputs();
        getUserDetails();
    }, []);

    // clear/reset inputs, other...
    const clearInputs = () => {
        // setEmail(null);
        // setPassword(null);
        // setHandleInpuEmailIsValid(false);
        // setHandleInputEmailClassName(null);
        // setButtonLoginUserIsDisabled(false);
        // setLoginUserStatus("");
        // setEmailNewCodeStatus("");

        setUser(null);
        setFullNameNew(null);
        setEmailNew(null);
        setUsernameNew(null);
        setPassword(null);
        setPasswordNew(null);
        setPasswordRepeatNew(null);
        setUserProfileImgNew(null);
        setUserProfileImgPreviewNew(null);
        setCode(null);
        setEmailNewCodeStatus("");
        setResponseStatusGetUserDetails("");
    }

    const handleInputFullName = async (e) => {

        const fullName = e.target.value;

        //setInputFullName(fullName);

        //setUser({fullName: fullName})

        //setUser({...user, fullName: fullName});

        setFullNameNew(fullName);



        // if (fullName.length > 100) {
        //     setHandleInpuFullNameIsValid(true);
        // } else if (fullName.length === 0) {
        //     setHandleInputFullNameClassName(null);
        // } else {
        //     setHandleInpuFullNameIsValid(false);
        // }
    }

    const handleInputEmail = async (e) => {

        const email = e.target.value;

        setEmailNew(email);

        /*  if (email.includes('@') && email.includes('.') && email.length > 3) {
             setHandleInpuEmailNewIsValid(true);
         } else if (email.length === 0) {
             setHandleInputEmailNewClassName(null);
         } else {
             setHandleInpuEmailNewIsValid(false);
         } */
    }

    const handleInputUsername = async (e) => {

        const username = e.target.value;

        setUsernameNew(username);

        /*  if (email.includes('@') && email.includes('.') && email.length > 3) {
             setHandleInpuEmailNewIsValid(true);
         } else if (email.length === 0) {
             setHandleInputEmailNewClassName(null);
         } else {
             setHandleInpuEmailNewIsValid(false);
         } */
    }

    const handleInputPassword = async (e) => {
        const password = e.target.value;
        setPassword(password);
    }

    const handleInputPasswordNew = async (e) => {
        const password = e.target.value;
        setPasswordNew(password);
    }

    const handleInputPasswordRepeatNew = async (e) => {
        const password = e.target.value;
        setPasswordRepeatNew(password);
    }


    const handleInputCode = async (e) => {
        const code = e.target.value;
        setCode(code);
    }

    const handleInputUserImageNew = (e) => {

        if (e.target.files) {
            setUserProfileImgNew(e.target.files[0]);
            setUserProfileImgPreviewNew(URL.createObjectURL(e.target.files[0]));
            //setPostImagePreviewNew(URL.createObjectURL(e.target.files[0]));

            // important: reset the value...
            e.target.value = null

        }
    }

    const getUserDetails = async () => {

        setResponseStatusGetUserDetails("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        await axios.get(`${url}/user/details`, config).then((res) => {

            if (res.status === 200) {
                setResponseStatusGetUserDetails("success");
                setUser({
                    fullName: res.data.fullName,
                    email: res.data.email,
                    username: res.data.username,
                    role: res.data.role,
                    registeredDate: res.data.registeredDate,
                    userProfileImg: res.data.userProfileImg
                })

                setFullNameNew(res.data.fullName);
                setUsernameNew(res.data.username);

            }

        }).catch(err => {
            setResponseStatusGetUserDetails("error");
            Logout();
            return;
        })

    }

    const updateUserDetails = async () => {

        //checkAllInputsValidity();

        // if (handleInputEmailIsValid) {

        //setButtonLoginUserIsDisabled(true);

        //if (passwordType === "text") {
        //setPasswordType("password");
        // }

        // if (passwordVisibleChecked) {
        //setPasswordVisibleChecked(!passwordVisibleChecked);
        //}

        //setLoginUserStatus("loading");
        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            email: user.email,
            //password: password

            fullName: fullNameNew
        }

        await axios.put(`${url}/user/details/update`, data, config).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error");
                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");
                    //setButtonLoginUserIsDisabled(false);
                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("User with that email not found");
                    //setLoginUserStatus("user_email_not_found");
                    //setButtonLoginUserIsDisabled(false);
                } else {
                    //secureLocalStorage.setItem("token", res.data.token);

                    toast.dismiss(toastNotify);

                    //getUserDetails();

                    //setLoginUserStatus("success");

                    window.location.reload(); // to update the value in header
                    //clearInputs();
                }
            }

        }).catch(err => {
            console.log(err);
            //setButtonLoginUserIsDisabled(false);
            toast.dismiss(toastNotify);
            toast.error("Error");
            //setLoginUserStatus("error");
            return;
        })

        //} else {
        //    return;
        //}

    }

    const updateUserEmail = async () => {

        //checkAllInputsValidity();

        // if (handleInputEmailIsValid) {

        //setButtonLoginUserIsDisabled(true);

        //if (passwordType === "text") {
        //setPasswordType("password");
        // }

        // if (passwordVisibleChecked) {
        //setPasswordVisibleChecked(!passwordVisibleChecked);
        //}

        //setLoginUserStatus("loading");
        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            old_email: user.email,
            password: password,
            new_email: emailNew.toLocaleLowerCase(),
            code: code
        }

        await axios.put(`${url}/user/email/update`, data, config).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error"); // Error save data to DB
                    //setEmailNewCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");
                    //setEmailNewCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("Account with that email doesn't exist");
                    //setButtonSendEmailCodeIsDisabled(false);
                    //setEmailNewCodeStatus("error");
                } else if (res.data.status_code === 5) {
                    toast.dismiss(toastNotify);
                    toast.error("Wrong verification code");
                    //setEmailNewCodeStatus("error");
                } else if (res.data.status_code === 7) {
                    toast.dismiss(toastNotify);
                    toast.error("Error while sending email, try again!");
                    //setEmailNewCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                    //resendEmailCode();
                } else if (res.data.status_code === 9) {
                    toast.dismiss(toastNotify);
                    toast.error("Wrong email or password");
                    //setButtonLoginUserIsDisabled(false);
                    //setEmailNewCodeStatus("error");
                } else {
                    //secureLocalStorage.setItem("token", res.data.token);

                    toast.dismiss(toastNotify);
                    toast.success("Email updated successfully");
                    //setEmailNewCodeStatus("success");

                    /*  navigate(
                         "/code/verify",
                         {
                             state: {
                                 email: email.toString().toLocaleLowerCase()
                             }
                         }
                     ) */

                    // OK

                    //window.location.reload();
                    clearInputs();
                    getUserDetails();
                }
            }

        }).catch(err => {
            console.log(err);
            //setButtonLoginUserIsDisabled(false);
            toast.dismiss(toastNotify);
            toast.error("Error");
            //setLoginUserStatus("error");
            return;
        })

        //} else {
        //    return;
        //}

    }

    const updateUserUsername = async () => {

        //checkAllInputsValidity();

        // if (handleInputEmailIsValid) {

        //setButtonLoginUserIsDisabled(true);

        //if (passwordType === "text") {
        //setPasswordType("password");
        // }

        // if (passwordVisibleChecked) {
        //setPasswordVisibleChecked(!passwordVisibleChecked);
        //}

        //setLoginUserStatus("loading");
        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            email: user.email,
            password: password,
            old_username: user.username,
            new_username: usernameNew.toLocaleLowerCase(),
        }

        await axios.put(`${url}/user/username/update`, data, config).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error"); // Error save data to DB
                    //setEmailNewCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");
                    //setEmailNewCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("Account with that email doesn't exist");
                    //setButtonSendEmailCodeIsDisabled(false);
                    //setEmailNewCodeStatus("error");
                } else if (res.data.status_code === 9) {
                    toast.dismiss(toastNotify);
                    toast.error("Wrong email or password");
                    //setButtonLoginUserIsDisabled(false);
                    //setEmailNewCodeStatus("error");
                } else {
                    //secureLocalStorage.setItem("token", res.data.token);

                    toast.dismiss(toastNotify);
                    toast.success("Username updated successfully");
                    //setEmailNewCodeStatus("success");

                    /*  navigate(
                         "/code/verify",
                         {
                             state: {
                                 email: email.toString().toLocaleLowerCase()
                             }
                         }
                     ) */

                    // OK

                    //window.location.reload();
                    clearInputs();
                    getUserDetails();
                }
            }

        }).catch(err => {
            console.log(err);
            //setButtonLoginUserIsDisabled(false);
            toast.dismiss(toastNotify);
            toast.error("Error");
            //setLoginUserStatus("error");
            return;
        })

        //} else {
        //    return;
        //}

    }

    const updateUserPassword = async () => {

        //checkAllInputsValidity();

        // if (handleInputEmailIsValid) {

        //setButtonLoginUserIsDisabled(true);

        //if (passwordType === "text") {
        //setPasswordType("password");
        // }

        // if (passwordVisibleChecked) {
        //setPasswordVisibleChecked(!passwordVisibleChecked);
        //}

        //setLoginUserStatus("loading");
        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            email: user.email,
            old_password: password,
            new_password: passwordNew
        }

        await axios.put(`${url}/user/password/update`, data, config).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error"); // Error save data to DB
                    //setEmailNewCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");
                    //setEmailNewCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("Account with that email doesn't exist");
                    //setButtonSendEmailCodeIsDisabled(false);
                    //setEmailNewCodeStatus("error");
                } else if (res.data.status_code === 8) {
                    toast.dismiss(toastNotify);
                    toast.error("Wrong old password");
                    //setButtonLoginUserIsDisabled(false);
                    //setEmailNewCodeStatus("error");
                } else if (res.data.status_code === 9) {
                    toast.dismiss(toastNotify);
                    toast.error("Wrong email or password");
                    //setButtonLoginUserIsDisabled(false);
                    //setEmailNewCodeStatus("error");
                } else {
                    //secureLocalStorage.setItem("token", res.data.token);

                    toast.dismiss(toastNotify);
                    toast.success("Password updated successfully");
                    //setEmailNewCodeStatus("success");

                    /*  navigate(
                         "/code/verify",
                         {
                             state: {
                                 email: email.toString().toLocaleLowerCase()
                             }
                         }
                     ) */

                    // OK
                    clearInputs();
                    //window.location.reload();
                    //getUserDetails();
                }
            }

        }).catch(err => {
            console.log(err);
            //setButtonLoginUserIsDisabled(false);
            toast.dismiss(toastNotify);
            toast.error("Error");
            //setLoginUserStatus("error");
            return;
        })

        //} else {
        //    return;
        //}

    }

    const updateUserProfileImage = async () => {

        //checkAllInputsValidity();

        // if (handleInputEmailIsValid) {

        //setButtonLoginUserIsDisabled(true);

        //if (passwordType === "text") {
        //setPasswordType("password");
        // }

        // if (passwordVisibleChecked) {
        //setPasswordVisibleChecked(!passwordVisibleChecked);
        //}

        //setLoginUserStatus("loading");
        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const formData = new FormData();
        formData.append("email", user.email);
        formData.append("userProfileImg", userProfileImgNew);

        //const data = formData

        await axios.put(`${url}/user/profile-image/update`, formData, config).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error");
                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");
                    //setButtonLoginUserIsDisabled(false);
                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("User with that email not found");
                    //setLoginUserStatus("user_email_not_found");
                    //setButtonLoginUserIsDisabled(false);
                } else {
                    //secureLocalStorage.setItem("token", res.data.token);

                    toast.dismiss(toastNotify);

                    //getUserDetails();

                    //setLoginUserStatus("success");

                    window.location.reload(); // to update the value in header
                    //clearInputs();
                }
            }

        }).catch(err => {
            console.log(err);
            //setButtonLoginUserIsDisabled(false);
            toast.dismiss(toastNotify);
            toast.error("Error");
            //setLoginUserStatus("error");
            return;
        })

        //} else {
        //    return;
        //}

    }

    const deleteUserProfileImage = async () => {

        //checkAllInputsValidity();

        // if (handleInputEmailIsValid) {

        //setButtonLoginUserIsDisabled(true);

        //if (passwordType === "text") {
        //setPasswordType("password");
        // }

        // if (passwordVisibleChecked) {
        //setPasswordVisibleChecked(!passwordVisibleChecked);
        //}

        //setLoginUserStatus("loading");
        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            email: user.email
        }

        await axios.post(`${url}/user/profile-image/delete`, data, config).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error");
                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");
                    //setButtonLoginUserIsDisabled(false);
                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("User with that email not found");
                    //setLoginUserStatus("user_email_not_found");
                    //setButtonLoginUserIsDisabled(false);
                } else {
                    //secureLocalStorage.setItem("token", res.data.token);

                    toast.dismiss(toastNotify);

                    //getUserDetails();

                    //setLoginUserStatus("success");

                    window.location.reload(); // to update the value in header
                    //clearInputs();
                }
            }

        }).catch(err => {
            console.log(err);
            //setButtonLoginUserIsDisabled(false);
            toast.dismiss(toastNotify);
            toast.error("Error");
            //setLoginUserStatus("error");
            return;
        })

        //} else {
        //    return;
        //}

    }


    const sendEmailNewCodeNoReply = async () => {

        setEmailNewCodeStatus("loading")
        const toastNotify = toast.loading("Send Email Code");

        const data = {
            old_email: user.email,
            new_email: emailNew.toString().toLocaleLowerCase()
        }

        await axios.post(`${url}/account/new-email/code/send`, data).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");
                    setEmailNewCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("Account with that email doesn't exist");
                    //setButtonSendEmailCodeIsDisabled(false);
                    setEmailNewCodeStatus("error");
                } else if (res.data.status_code === 7) {
                    toast.dismiss(toastNotify);
                    toast.error("Error while sending email, try again!");
                    setEmailNewCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                    //resendEmailCode();
                } else {
                    //secureLocalStorage.setItem("token", res.data.token);

                    toast.dismiss(toastNotify);
                    toast.success("Email sent successfully");
                    setEmailNewCodeStatus("success");

                    /*  navigate(
                         "/code/verify",
                         {
                             state: {
                                 email: email.toString().toLocaleLowerCase()
                             }
                         }
                     ) */

                    // OK

                    //window.location.reload();
                    //clearInputs();
                }
            }

        }).catch(err => {
            //setButtonSendEmailCodeIsDisabled(false);
            toast.dismiss(toastNotify);
            toast.error("Error Send Email");
            setEmailNewCodeStatus("error");
            return;
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
    }


    return (
        <div className="d-flex justify-content-center">

            <div className="container-fluid" style={{ maxWidth: 400 }}>
                <div className="card text-left shadow-lg animate__animated animate__fadeIn">
                    <div className="card-header text-center fw-semibold">
                        <i className="bi bi-person-fill me-2" />
                        User Details
                    </div>
                    <div className="card-body">

                        {
                            responseStatusGeUserDetails === "loading" ? <LoadingSmall /> :
                                responseStatusGeUserDetails === "error" ? <Error /> :
                                    responseStatusGeUserDetails === "success" ?

                                        <>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item">
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">

                                                        <img src={user?.userProfileImg ? `data:image/png;base64,${user.userProfileImg}` : default_user_profile_img} width="90" height="90" style={{ objectFit: "cover" }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" />

                                                    </div>
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                                        <div className="dropdown">
                                                            <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-pencil-square"></i></button>
                                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ cursor: 'pointer' }}>
                                                                    <i className="bi bi-x-lg"></i>
                                                                </span>
                                                                {userProfileImgPreviewNew &&
                                                                    <>
                                                                        <button type="button" className="btn-close mb-3" aria-label="Close" onClick={(e) => { setUserProfileImgPreviewNew(null); setUserProfileImgNew(null) }}></button>
                                                                        <img src={userProfileImgPreviewNew} width="90" height="90" style={{ objectFit: "cover" }} alt="user-profile-img" className="rounded-circle border border-primary border-3 mb-3" />
                                                                    </>

                                                                }

                                                                <form onSubmit={handleSubmit}>
                                                                    <li className="container-fluid mb-3">

                                                                        {(!userProfileImgNew && !userProfileImgPreviewNew) &&

                                                                            <>
                                                                                <input type="file" className="form-control form-control-sm" name="userProfileImagenew" id="userProfileImagenew" accept="image/jpeg" style={{ display: 'none' }} onChange={(e) => handleInputUserImageNew(e)} required />
                                                                                <label htmlFor="userProfileImagenew" className="btn btn-secondary btn-sm me-md-2">Upload Image</label>
                                                                                <small className="text-secondary">max: 10mb / .jpg</small>
                                                                            </>
                                                                        }



                                                                    </li>
                                                                    <li><button className="btn btn-secondary btn-sm rounded-pill fw-semibold" style={{ paddingLeft: 15, paddingRight: 15 }} onClick={updateUserProfileImage} disabled={!userProfileImgNew}>Update</button></li>
                                                                </form>
                                                            </ul>
                                                        </div>
                                                        {user?.userProfileImg &&
                                                            <div className="dropdown">
                                                                <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-x-circle-fill text-danger"></i></button>
                                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                    <p><small className="text-secondary">Delete Imgae?</small></p>
                                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={deleteUserProfileImage}>Yes</button>
                                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                                </ul>
                                                            </div>
                                                        }

                                                    </div>
                                                </li>


                                                <li className="list-group-item">
                                                    <div className="d-grid gap-2 d-md-flex">
                                                        <small className="me-md-2"><strong>Full Name:</strong> {user?.fullName}</small>
                                                        <div className="dropdown">
                                                            <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-pencil-square"></i></button>
                                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ cursor: 'pointer' }}>
                                                                    <i className="bi bi-x-lg"></i>
                                                                </span>
                                                                <form onSubmit={handleSubmit}>
                                                                    <li className="container-fluid mb-3">
                                                                        <input type="text" className="form-control form-control-sm" id="inputFullNameNew" placeholder="New: Full Name" value={fullNameNew} onChange={(e) => handleInputFullName(e)} autoComplete="off" required />
                                                                        {fullNameNew?.length > 0 &&
                                                                            <small className="text-secondary">{fullNameNew?.length}/100</small>
                                                                        }

                                                                    </li>
                                                                    <li><button className="btn btn-secondary btn-sm rounded-pill fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} onClick={updateUserDetails} disabled={!fullNameNew || fullNameNew > 100}>Update</button></li>
                                                                </form>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <div className="d-grid gap-2 d-md-flex">
                                                        <small><strong>Email:</strong> {user?.email}</small>
                                                        <div className="dropdown">
                                                            <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-pencil-square"></i></button>
                                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ cursor: 'pointer' }}>
                                                                    <i className="bi bi-x-lg"></i>
                                                                </span>
                                                                <form onSubmit={handleSubmit}>
                                                                    <li className="container-fluid mb-3">
                                                                        {emailNew && code ?

                                                                            <input type="password" className="form-control form-control-sm mb-3" id="inputPassword" placeholder="Password" onChange={(e) => handleInputPassword(e)} autoComplete="off" required />
                                                                            :
                                                                            <>
                                                                                <p><small>Password will be required</small></p>
                                                                                <p><small>Verification code will be sent on new email</small></p>
                                                                            </>
                                                                        }

                                                                        <input type="email" className="form-control form-control-sm mb-3" id="inputEmailNew" placeholder="New: Email" name="emailNew" onChange={(e) => handleInputEmail(e)} autoComplete="off" required noValidate />

                                                                        {emailNewCodeStatus === "success" &&
                                                                            <input type="text" className="form-control form-control-sm mb-3" id="inputCode" placeholder="Code from new Email" onChange={(e) => handleInputCode(e)} autoComplete="off" required />
                                                                        }

                                                                        {emailNew && !code && user.email !== emailNew &&
                                                                            <button type="button" className="btn btn-secondary btn-sm rounded-pill fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} onClick={sendEmailNewCodeNoReply} disabled={!emailNew || emailNewCodeStatus === "loading"}>Send Code</button>
                                                                        }

                                                                        {user.email === emailNew &&
                                                                            <small>Warning: same email</small>
                                                                        }

                                                                    </li>
                                                                    {password && emailNew && code &&
                                                                        <li><button className="btn btn-secondary btn-sm rounded-pill fw-semibold" style={{ paddingLeft: 15, paddingRight: 15 }} onClick={updateUserEmail}>Update</button></li>
                                                                    }
                                                                </form>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <div className="d-grid gap-2 d-md-flex">
                                                        <small><strong>Username:</strong> {user?.username}</small>
                                                        <div className="dropdown">
                                                            <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-pencil-square"></i></button>
                                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{cursor: 'pointer'}}>
                                                                    <i className="bi bi-x-lg"></i>
                                                                </span>
                                                                <form onSubmit={handleSubmit} className="container-fluid">
                                                                    <li className="mb-3">
                                                                        <input type="text" className="form-control form-control-sm" id="inputUsernameNew" placeholder="New: Username" value={usernameNew} onChange={(e) => handleInputUsername(e)} autoComplete="off" required />
                                                                        {usernameNew?.length > 0 &&
                                                                            <small className="text-secondary">{usernameNew?.length}/20</small>
                                                                        }

                                                                    </li>
                                                                    <li><input type="password" className="form-control form-control-sm mb-3" id="inputPassword" placeholder="Password" onChange={(e) => handleInputPassword(e)} autoComplete="off" required /></li>
                                                                    <li><button className="btn btn-secondary btn-sm rounded-pill fw-semibold" style={{ paddingLeft: 15, paddingRight: 15 }} onClick={updateUserUsername} disabled={!usernameNew || !password || usernameNew.length > 20}>Update</button></li>
                                                                </form>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item"><small><strong>Role:</strong> {user?.role}</small></li>
                                                <li className="list-group-item"><small><strong>Registered:</strong> {moment(user?.registeredDate).locale(moment_locale).format(moment_format_date_time_long)}</small></li>
                                                <li className="list-group-item">
                                                    <div className="d-grid gap-2 d-md-flex">
                                                        <small><strong>Password:</strong> ******</small>
                                                        <div className="dropdown">
                                                            <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-pencil-square"></i></button>
                                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{cursor: 'pointer'}}>
                                                                    <i className="bi bi-x-lg"></i>
                                                                </span>
                                                                <form onSubmit={handleSubmit} className="container-fluid">
                                                                    <li><input type="password" className="form-control form-control-sm mb-3" id="inputPasswordOld" placeholder="Old: Password" onChange={(e) => handleInputPassword(e)} autoComplete="off" required /></li>
                                                                    <li><input type="password" className="form-control form-control-sm mb-3" id="inputPasswordNew" placeholder="New: Password" onChange={(e) => handleInputPasswordNew(e)} autoComplete="off" required /></li>
                                                                    <li><input type="password" className="form-control form-control-sm mb-3" id="inputPasswordRepeatNew" placeholder="New: Password Repeat" onChange={(e) => handleInputPasswordRepeatNew(e)} autoComplete="off" required /></li>
                                                                    {passwordNew !== passwordRepeatNew &&
                                                                        <small>Warning: new passwords must match!</small>
                                                                    }
                                                                    <li><button className="btn btn-secondary btn-sm rounded-pill fw-semibold" style={{ paddingLeft: 15, paddingRight: 15 }} onClick={updateUserPassword} disabled={!password || !passwordNew || passwordRepeatNew !== passwordNew || passwordNew.length > 100}>Update</button></li>
                                                                </form>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>

                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                            Accordion Item #1
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTwo">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                            Accordion Item #2
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingThree">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                            Accordion Item #3
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </>


                                        :
                                        <></>
                        }


                    </div>
                    <div className="card-footer text-center text-muted">
                        <small className="me-2">Don't have an account?</small>
                        {/* <UserPasswordRecover /> */}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default UserDetails;