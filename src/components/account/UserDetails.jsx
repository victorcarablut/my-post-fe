import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../../config.js";


import { VerifyToken } from '../security/VerifyToken.js';
import { Logout } from './Logout.js';


import { Error } from '../_resources/ui/Alerts.jsx';

// Date Time Format (moment.js)
import moment from 'moment/min/moment-with-locales';
import { moment_locale, moment_format_date_time_long } from '../_resources/date-time/DateTime.js';

import default_user_profile_img from '../../assets/images/user.jpg';
import default_user_cover_img from '../../assets/images/cover.jpg';

// Notifications
import toast from 'react-hot-toast';


function UserDetails() {

    const [user, setUser] = useState(
        {
            id: null,
            fullName: null,
            email: null,
            username: null,
            role: null,
            registeredDate: null,
            userProfileImg: null,
            userCoverImg: null
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
    const [userCoverImgNew, setUserCoverImgNew] = useState(null);
    const [userCoverImgPreviewNew, setUserCoverImgPreviewNew] = useState(null);

    // http response status
    const [responseStatusGeUserDetails, setResponseStatusGetUserDetails] = useState("");

    const [emailNewCodeStatus, setEmailNewCodeStatus] = useState("");

    useEffect(() => {

        checkAuth();
        clearInputs();
        getUserDetails();

    }, []);

    const checkAuth = async () => {
        const verifyToken = await VerifyToken();
        if (!verifyToken) {
            await Logout();
        }
    }

    // clear/reset inputs, other...
    const clearInputs = () => {
        setUser(null);
        setFullNameNew(null);
        setEmailNew(null);
        setUsernameNew(null);
        setPassword(null);
        setPasswordNew(null);
        setPasswordRepeatNew(null);
        setUserProfileImgNew(null);
        setUserCoverImgNew(null);
        setUserProfileImgPreviewNew(null);
        setUserCoverImgPreviewNew(null);
        setCode(null);
        setEmailNewCodeStatus("");
        setResponseStatusGetUserDetails("");
    }

    const handleInputFullName = async (e) => {
        const fullName = e.target.value;
        setFullNameNew(fullName);
    }

    const handleInputEmail = async (e) => {
        const email = e.target.value;
        setEmailNew(email);
    }

    const handleInputUsername = async (e) => {
        const username = e.target.value;
        setUsernameNew(username);
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

            // important: reset the value...
            e.target.value = null
        }
    }

    const handleInputUserCoverImageNew = (e) => {

        if (e.target.files) {
            setUserCoverImgNew(e.target.files[0]);
            setUserCoverImgPreviewNew(URL.createObjectURL(e.target.files[0]));

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
                    id: res.data.id,
                    fullName: res.data.fullName,
                    email: res.data.email,
                    username: res.data.username,
                    role: res.data.role,
                    registeredDate: res.data.registeredDate,
                    userProfileImg: res.data.userProfileImg,
                    userCoverImg: res.data.userCoverImg
                })

                setFullNameNew(res.data.fullName);
                setUsernameNew(res.data.username);

            }

        }).catch(err => {
            setResponseStatusGetUserDetails("error");
            return;
        })

    }

    const updateUserDetails = async () => {

        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            email: user.email,
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

                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("User with that email not found");

                } else {
                    toast.dismiss(toastNotify);
                    window.location.reload(); // to update the value in header also
                }
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            return;
        })


    }

    const updateUserEmail = async () => {

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

                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");

                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("Account with that email doesn't exist");

                } else if (res.data.status_code === 5) {
                    toast.dismiss(toastNotify);
                    toast.error("Wrong verification code");

                } else if (res.data.status_code === 7) {
                    toast.dismiss(toastNotify);
                    toast.error("Error while sending email, try again!");

                } else if (res.data.status_code === 9) {
                    toast.dismiss(toastNotify);
                    toast.error("Wrong email or password");

                } else {
                    toast.dismiss(toastNotify);
                    toast.success("Email updated successfully");
                    clearInputs();
                    getUserDetails();
                }
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            return;
        })


    }

    const updateUserUsername = async () => {

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

                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");

                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("Account with that email doesn't exist");

                } else if (res.data.status_code === 9) {
                    toast.dismiss(toastNotify);
                    toast.error("Wrong email or password");

                } else if (res.data.status_code === 10) {
                    toast.dismiss(toastNotify);
                    toast.error("Account with that username already exists");

                } else {
                    toast.dismiss(toastNotify);
                    toast.success("Username updated successfully");

                    clearInputs();
                    getUserDetails();
                }
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            return;
        })

    }

    const updateUserPassword = async () => {

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

                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");

                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("Account with that email doesn't exist");

                } else if (res.data.status_code === 8) {
                    toast.dismiss(toastNotify);
                    toast.error("Wrong old password");

                } else if (res.data.status_code === 9) {
                    toast.dismiss(toastNotify);
                    toast.error("Wrong email or password");

                } else {
                    toast.dismiss(toastNotify);
                    toast.success("Password updated successfully");
                    clearInputs();
                }
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            return;
        })

    }

    const updateUserImage = async (filter) => {
        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const formData = new FormData();
        formData.append("email", user.email);

        if (filter === "profile") {
            formData.append("filter", "profile");
            formData.append("userImg", userProfileImgNew);
        } else {
            formData.append("filter", "cover");
            formData.append("userImg", userCoverImgNew);
        }

        await axios.put(`${url}/user/image/update`, formData, config).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error");

                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");

                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("User with that email not found");

                } else {
                    toast.dismiss(toastNotify);
                    window.location.reload(); // to update the value in header
                }
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            return;
        })


    }


    const deleteUserImage = async (filter) => {

        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            filter: filter === "profile" ? "profile" : "cover",
            email: user.email
        }

        await axios.post(`${url}/user/image/delete`, data, config).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error");

                } else if (res.data.status_code === 2) {
                    toast.dismiss(toastNotify);
                    toast.error("Invalid email format");

                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("User with that email not found");

                } else {
                    toast.dismiss(toastNotify);
                    window.location.reload(); // to update the value in header
                }
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            return;
        })

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

                } else if (res.data.status_code === 4) {
                    toast.dismiss(toastNotify);
                    toast.error("Account with that email doesn't exist");
                    setEmailNewCodeStatus("error");

                } else if (res.data.status_code === 7) {
                    toast.dismiss(toastNotify);
                    toast.error("Error while sending email, try again!");
                    setEmailNewCodeStatus("error");

                } else {
                    toast.dismiss(toastNotify);
                    toast.success("Email sent successfully");
                    setEmailNewCodeStatus("success");
                }
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error Send Email");
            setEmailNewCodeStatus("error");
            return;
        })
    }

    const deleteAccount = async () => {

        const toastNotify = toast.loading("Loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            userId: user.id,
            password: password
        }

        await axios.post(`${url}/user/account/delete`, data, config).then((res) => {

            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error");

                } else if (res.data.status_code === 9) {
                    toast.dismiss(toastNotify);
                    toast.error("Error Password");

                } else {
                    toast.dismiss(toastNotify);
                    clearInputs();

                    logout();

                }
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            return;
        })

    }

    // external function to remove token from memory
    const logout = async () => {

        return await Logout();
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

                        {responseStatusGeUserDetails === "error" && <Error />}

                        {responseStatusGeUserDetails === "success" &&


                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                        <img src={user?.userCoverImg ? `data:image/jpg;base64,${user.userCoverImg}` : default_user_cover_img} width="100%" height="100" alt="cover-img" className="card-img-top mb-3" style={{ objectFit: "cover" }} />
                                    </div>

                                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                        <div className="dropdown">
                                            <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-pencil-square"></i>
                                                {userCoverImgPreviewNew &&
                                                    <span className="position-absolute top-0 start-100 translate-middle p-2 bg-primary border border-light rounded-circle animate__animated animate__flash animate__infinite"></span>
                                                }
                                            </button>

                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ cursor: 'pointer' }}>
                                                    <i className="bi bi-x-lg"></i>
                                                </span>
                                                {userCoverImgPreviewNew &&
                                                    <div className="container-fluid">
                                                        <button type="button" className="btn-close mb-3" aria-label="Close" onClick={(e) => { setUserCoverImgPreviewNew(null); setUserCoverImgNew(null) }}></button>
                                                        <img src={userCoverImgPreviewNew} width="350" height="150" style={{ objectFit: "cover" }} alt="user-cover-img" className="rounded border border-primary border-3 mb-3" />
                                                    </div>

                                                }

                                                <form onSubmit={handleSubmit}>
                                                    <li className="container-fluid mb-2">

                                                        {(!userCoverImgNew && !userCoverImgPreviewNew) &&

                                                            <>
                                                                <input type="file" className="form-control form-control-sm" name="userCoverImageNew" id="userCoverImageNew" accept="image/jpeg" style={{ display: 'none' }} onChange={(e) => handleInputUserCoverImageNew(e)} required />
                                                                <label htmlFor="userCoverImageNew" className="btn btn-secondary btn-sm me-md-2">Upload Image</label>
                                                                <small className="text-secondary">max: 10mb / .jpg</small>
                                                            </>
                                                        }

                                                    </li>
                                                    <li><button className={"btn " + (userCoverImgPreviewNew ? "btn-primary" : "btn-secondary") + " btn-sm rounded-pill fw-semibold"} style={{ paddingLeft: 15, paddingRight: 15 }} onClick={() => updateUserImage("cover")} disabled={!userCoverImgNew}>Update</button></li>
                                                </form>
                                            </ul>
                                        </div>
                                        {user?.userCoverImg &&
                                            <div className="dropdown">
                                                <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-x-circle-fill text-danger"></i></button>
                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                    <p><small className="text-secondary">Delete Imgae?</small></p>
                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={() => deleteUserImage("cover")}>Yes</button>
                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                </ul>
                                            </div>
                                        }

                                    </div>

                                    <hr />


                                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                        <img src={user?.userProfileImg ? `data:image/png;base64,${user.userProfileImg}` : default_user_profile_img} width="90" height="90" style={{ objectFit: "cover" }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" />
                                    </div>
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                        <div className="dropdown">
                                            <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-pencil-square"></i>
                                                {userProfileImgPreviewNew &&
                                                    <span className="position-absolute top-0 start-100 translate-middle p-2 bg-primary border border-light rounded-circle animate__animated animate__flash animate__infinite"></span>
                                                }
                                            </button>

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
                                                    <li className="container-fluid mb-2">

                                                        {(!userProfileImgNew && !userProfileImgPreviewNew) &&

                                                            <>
                                                                <input type="file" className="form-control form-control-sm" name="userProfileImagenew" id="userProfileImagenew" accept="image/jpeg" style={{ display: 'none' }} onChange={(e) => handleInputUserImageNew(e)} required />
                                                                <label htmlFor="userProfileImagenew" className="btn btn-secondary btn-sm me-md-2">Upload Image</label>
                                                                <small className="text-secondary">max: 10mb / .jpg</small>
                                                            </>
                                                        }



                                                    </li>
                                                    <li><button className={"btn " + (userProfileImgPreviewNew ? "btn-primary" : "btn-secondary") + " btn-sm rounded-pill fw-semibold"} style={{ paddingLeft: 15, paddingRight: 15 }} onClick={() => updateUserImage("profile")} disabled={!userProfileImgNew}>Update</button></li>
                                                </form>
                                            </ul>
                                        </div>
                                        {user?.userProfileImg &&
                                            <div className="dropdown">
                                                <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-x-circle-fill text-danger"></i></button>
                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                    <p><small className="text-secondary">Delete Imgae?</small></p>
                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={() => deleteUserImage("profile")}>Yes</button>
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
                                                <form onSubmit={handleSubmit} style={{ minWidth: 200 }}>
                                                    <li className="container-fluid mb-3">
                                                        <input type="text" className="form-control form-control-sm" id="inputFullNameNew" placeholder="New: Full Name" maxLength="100" value={fullNameNew} onChange={(e) => handleInputFullName(e)} autoComplete="off" required />
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
                                                <form onSubmit={handleSubmit} style={{ minWidth: 200 }}>
                                                    <li className="container-fluid mb-3">
                                                        {emailNew && code ?

                                                            <input type="password" className="form-control form-control-sm mb-3" id="inputPassword" placeholder="Password" onChange={(e) => handleInputPassword(e)} autoComplete="off" required />
                                                            :
                                                            <>
                                                                <p><small>Password will be required</small></p>
                                                                <p><small>Verification code will be sent on new email</small></p>
                                                            </>
                                                        }

                                                        <input type="email" className="form-control form-control-sm mb-3" id="inputEmailNew" placeholder="New: Email" name="emailNew" maxLength="100" onChange={(e) => handleInputEmail(e)} autoComplete="off" required noValidate />

                                                        {emailNewCodeStatus === "success" &&
                                                            <input type="text" className="form-control form-control-sm mb-3" id="inputCode" placeholder="Code from new Email" maxLength="6" onChange={(e) => handleInputCode(e)} autoComplete="off" required />
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
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ cursor: 'pointer' }}>
                                                    <i className="bi bi-x-lg"></i>
                                                </span>
                                                <form onSubmit={handleSubmit} className="container-fluid" style={{ minWidth: 200 }}>
                                                    <li className="mb-3">
                                                        <input type="text" className="form-control form-control-sm" id="inputUsernameNew" placeholder="New: Username" maxLength="20" value={usernameNew} onChange={(e) => handleInputUsername(e)} autoComplete="off" required />
                                                        {usernameNew?.length > 0 &&
                                                            <small className="text-secondary">{usernameNew?.length}/20 | a-z 0-9 - _ .</small>
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
                                { user?.updatedDate && 
                                <li className="list-group-item"><small><strong>Updated:</strong> {moment(user?.updatedDate).locale(moment_locale).format(moment_format_date_time_long)}</small></li>
                                }         
                                <li className="list-group-item">
                                    <div className="d-grid gap-2 d-md-flex">
                                        <small><strong>Password:</strong> ******</small>
                                        <div className="dropdown">
                                            <button className="btn btn-light btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false"><i className="bi bi-pencil-square"></i></button>
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ cursor: 'pointer' }}>
                                                    <i className="bi bi-x-lg"></i>
                                                </span>
                                                <form onSubmit={handleSubmit} className="container-fluid" style={{ minWidth: 200 }}>
                                                    <li><input type="password" className="form-control form-control-sm mb-3" id="inputPasswordOld" placeholder="Old: Password" maxLength="100" onChange={(e) => handleInputPassword(e)} autoComplete="off" required /></li>
                                                    <li><input type="password" className="form-control form-control-sm mb-3" id="inputPasswordNew" placeholder="New: Password" maxLength="100" onChange={(e) => handleInputPasswordNew(e)} autoComplete="off" required /></li>
                                                    <li><input type="password" className="form-control form-control-sm mb-3" id="inputPasswordRepeatNew" placeholder="New: Password Repeat" maxLength="100" onChange={(e) => handleInputPasswordRepeatNew(e)} autoComplete="off" required /></li>
                                                    {passwordNew !== passwordRepeatNew &&
                                                        <small>New passwords must match!</small>
                                                    }
                                                    <li><button className="btn btn-secondary btn-sm rounded-pill fw-semibold" style={{ paddingLeft: 15, paddingRight: 15 }} onClick={updateUserPassword} disabled={!password || !passwordNew || passwordRepeatNew !== passwordNew || passwordNew.length > 100}>Update</button></li>
                                                </form>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                        }

                    </div>
                    <div className="card-footer text-center">

                        {responseStatusGeUserDetails === "success" &&

                            <div className="dropdown">
                                <button className="btn btn-light btn-sm dropdown-toggle rounded-pill text-danger" type="button" data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false">Delete Account</button>
                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ cursor: 'pointer' }}>
                                        <i className="bi bi-x-lg"></i>
                                    </span>
                                    <div className="container-fluid">
                                        <p><small className="text-secondary">Your account and all your data will be deleted permanently.</small></p>
                                        <p><small className="text-secondary">For security reasons password is required.</small></p>
                                    </div>
                                    <form onSubmit={handleSubmit} className="container-fluid" style={{ minWidth: 200 }}>
                                        <li><input type="password" className="form-control form-control-sm mb-3" placeholder="Password" maxLength="100" onChange={(e) => handleInputPassword(e)} autoComplete="off" required /></li>
                                        <li><button className="btn btn-danger btn-sm rounded-pill fw-semibold" style={{ paddingLeft: 15, paddingRight: 15 }} onClick={deleteAccount} disabled={!password}>Delete</button></li>
                                    </form>
                                </ul>
                            </div>
                        }

                    </div>

                </div>
            </div>
        </div>

    )
}

export default UserDetails;