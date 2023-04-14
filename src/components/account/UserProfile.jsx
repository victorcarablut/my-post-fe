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

import Post from "../Post.jsx";


function UserProfile() {

    const { username } = useParams();

    const [user, setUser] = useState(
        {
            fullName: null,
            email: null,
            username: null,
            //role: null,
            registeredDate: null,
            userProfileImg: null,
            coverProfileImg: null
        }
    )

    useEffect(() => {
        //console.log(username);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        getUserDetails();
    }, [username]);


    const getUserDetails = async () => {

        //setResponseStatusGetUserDetails("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        await axios.get(`${url}/user/` + username, config).then((res) => {

            if (res.status === 200) {

                //console.log(res.data.fullName);
                //setResponseStatusGetUserDetails("success");
                setUser({
                    fullName: res.data.fullName,
                    email: res.data.email,
                    username: res.data.username,
                    //role: res.data.role,
                    registeredDate: res.data.registeredDate,
                    userProfileImg: res.data.userProfileImg,
                    coverProfileImg: res.data.coverProfileImg
                })



            }

        }).catch(err => {
            //setResponseStatusGetUserDetails("error");
            //Logout();
            return;
        })

    }

    return (

        <>


            <div className="d-flex justify-content-center mb-3">
                <div className="container-fluid" style={{ maxWidth: 1400 }}>

                    <div className="card shadow">

                        <img src={user?.coverProfileImg ? `data:image/jpg;base64,${user.coverProfileImg}` : default_user_cover_img} width="100%" height="200" alt="cover-img" className="card-img-top" style={{objectFit: "cover"}} />

                        <div className="card-body">

                            <div className="d-grid gap-2 d-md-flex justify-content-md-left">
                                <img src={user?.userProfileImg ? `data:image/jpg;base64,${user.userProfileImg}` : default_user_profile_img} width="120" height="120" style={{ objectFit: "cover", marginTop: -75 }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" />
                                <h5 className="me-md-2">{user?.fullName}</h5>
                                <button type="button" className="btn btn-secondary btn-sm">Small button</button>
                            </div>

                            <hr />
                            <small className="text-secondary">Username: @{user?.username}</small>
                            



                            {/* <NavLink to="/account" type="button" className="btn btn-light btn-sm">Edit User</NavLink> */}


                        </div>
                        <div className="card-footer">
                        <small className="text-secondary">Account created on {moment(user?.registeredDate).locale(moment_locale).format(moment_format_date_long)}</small>
                        </div>
                    </div>

                </div>

            </div>





            <Post filter={username} />

        </>
    )
}

export default UserProfile;