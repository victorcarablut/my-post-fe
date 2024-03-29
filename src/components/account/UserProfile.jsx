import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../../config.js";

// Date Time Format (moment.js)
import moment from 'moment/min/moment-with-locales';
import { moment_locale, moment_format_date_long } from '../_resources/date-time/DateTime.js';
//import UserPasswordRecover from './UserPasswordRecover.jsx';

import default_user_profile_img from '../../assets/images/user.jpg';
import default_user_cover_img from '../../assets/images/cover.jpg';

import Posts from "../Posts.jsx";
import { Error } from "../_resources/ui/Alerts.jsx";

import { VerifyToken } from "../security/VerifyToken.js";
import { Logout } from "./Logout.js";

function UserProfile() {

    const { username } = useParams();

    const [userIdAccount, setUserIdAccount] = useState(null);
    const [usernameAccount, setUsernameAccount] = useState(null);
    const [userEmailAccount, setUserEmailAccount] = useState(null);

    const [user, setUser] = useState(
        {

            fullName: null,
            email: null,
            username: null,
            role: null,
            status: null,
            registeredDate: null,
            userProfileImg: null,
            userCoverImg: null
        }
    )

    // http response status
    const [responseStatusGetUserDetails, setResponseStatusGetUserDetails] = useState("");

    useEffect(() => {

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    }, [username]);

    useEffect(() => {

        const checkAuth = async () => {
            const verifyToken = await VerifyToken();
            if (!verifyToken) {
                await Logout();
            } else {
                await getUserDetails();
            }
        }

        checkAuth();

    }, [username]);





    const getUserDetails = async () => {

        setResponseStatusGetUserDetails("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        // actual user
        await axios.get(`${url}/user/details`, config).then((res) => {
            if (res.status === 200) {

                setResponseStatusGetUserDetails("success");
                setUserIdAccount(res.data.id)
                setUsernameAccount(res.data.username);
                setUserEmailAccount(res.data.email);
            }
        }).catch(err => {
            setResponseStatusGetUserDetails("error");
            return;
        })

        // user
        await axios.get(`${url}/user/` + username, config).then((res) => {

            if (res.status === 200) {

                setResponseStatusGetUserDetails("success");

                setUser({

                    fullName: res.data.fullName,
                    email: res.data.email,
                    username: res.data.username,
                    role: res.data.role,
                    status: res.data.status,
                    registeredDate: res.data.registeredDate,
                    userProfileImg: res.data.userProfileImg,
                    userCoverImg: res.data.userCoverImg
                })

            }

        }).catch(err => {
            setResponseStatusGetUserDetails("error");
            return;
        })

    }












    return (

        <>
            <div className="d-flex justify-content-center mb-3">

                <div className="position-relative">
                    <div className="position-absolute top-0 start-0">
                        {responseStatusGetUserDetails === "loading" &&
                            <div className="spinner-border spinner-border-sm text-light" style={{ marginLeft: 10 }} role="status" />
                        }
                    </div>
                </div>

                <div className="container-fluid" style={{ maxWidth: 1400 }}>


                    <div className="card shadow">


                        {(user && responseStatusGetUserDetails !== "error") &&
                            <>
                                <img src={user?.userCoverImg ? `data:image/jpg;base64,${user.userCoverImg}` : default_user_cover_img} width="100%" height="200" alt="cover-img" className="card-img-top" style={{ objectFit: "cover" }} />

                                <div className="card-body">

                                    <div className="d-grid gap-2 d-md-flex justify-content-md-left">
                                        <img src={user?.userProfileImg ? `data:image/jpg;base64,${user.userProfileImg}` : default_user_profile_img} width="120" height="120" style={{ objectFit: "cover", marginTop: -75 }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" />

                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <h5 className="me-md-2">{user?.fullName}</h5>
                                            {usernameAccount === user?.username &&
                                                <NavLink to="/account" type="button" className="btn btn-light rounded-pill btn-sm" style={{ maxHeight: 30 }}><i className="bi bi-pencil-square me-md-2"></i>Edit Profile</NavLink>
                                            }
                                        </div>





                                    </div>

                                    <hr />
                                    <small className="text-secondary">Username: @{user?.username}</small>
                                    <br />



                                    <small className="text-secondary me-md-2">User profile status:</small>

                                    {user.status === "warning" ?
                                        <span className="badge rounded-pill text-bg-warning" aria-label="The user have violated some of our rules" data-balloon-pos="right">{user.status}</span>
                                        :
                                        <span className="badge rounded-pill text-bg-success" aria-label="No suspicious activity found" data-balloon-pos="right">{user.status}</span>
                                    }




                                </div>
                                <div className="card-footer">
                                    <small className="text-secondary">Account created on {moment(user?.registeredDate).locale(moment_locale).format(moment_format_date_long)}</small>
                                </div>

                            </>
                        }
                        {responseStatusGetUserDetails === "error" && <Error />}
                    </div>




                </div>

            </div>



            {(responseStatusGetUserDetails !== "error" && username && usernameAccount) &&

                <Posts filter={username} userId={userIdAccount} username={usernameAccount} userEmail={userEmailAccount} />
            }

        </>
    )
}

export default UserProfile;