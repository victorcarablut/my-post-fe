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
import { moment_locale, moment_format_date_time_long } from '../_resources/date-time/DateTime.js';
//import UserPasswordRecover from './UserPasswordRecover.jsx';

import default_user_profile_img from '../../assets/images/user.jpg';


function UserProfile() {

    const { username } = useParams();

    const [user, setUser] = useState(
        {
            fullName: null,
            email: null,
            username: null,
            //role: null,
            registeredDate: null,
            userProfileImg: null
        }
    )

    useEffect(() => {
        console.log(username);

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
                    userProfileImg: res.data.userProfileImg
                })



            }

        }).catch(err => {
            //setResponseStatusGetUserDetails("error");
            //Logout();
            return;
        })

    }

    return (

        <div className="container-fluid">

            <div className="row">

                <div className="col-xl-6" style={{ paddingBottom: 20 }}>

                    <div className="d-flex justify-content-center mb-3">
                        <div className="card container-fluid shadow" style={{ maxWidth: 500 }}>
                            <div className="card-body">

                                <div className="d-grid gap-2 d-md-flex justify-content-md-left">

                                    <img src={user?.userProfileImg ? `data:image/png;base64,${user.userProfileImg}` : default_user_profile_img} width="90" height="90" style={{ objectFit: "cover", marginTop: -60 }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" />
                                    <h6>{user?.fullName}</h6>
                                </div>

                                <h6>Create Post</h6>
                                <NavLink to="/account" type="button" className="btn btn-light btn-sm">Edit User</NavLink>


                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <div className="card container-fluid shadow" style={{ maxWidth: 500 }}>
                            <div className="card-body">
                                This is some text within a card body.

                            </div>
                        </div>
                    </div>

                </div>



                <div className="col-xl-6" style={{ paddingBottom: 20 }}>

                    <div>



                        <div className="d-flex justify-content-center">
                            <div className="card container-fluid shadow" style={{ maxWidth: 600 }}>
                                <div className="card-body">
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                        <span className="badge text-bg-primary">Primary</span>
                                        <span className="badge text-bg-success">Success</span>
                                        <span className="badge text-bg-danger">Danger</span>
                                        <span className="badge text-bg-warning">Warning</span>
                                        <span className="badge text-bg-info">Info</span>
                                        <span className="badge text-bg-light">Light</span>
                                        <span className="badge text-bg-dark">Dar</span>
                                    </div>




                                    {/* {
                                            responseStatusGetAllPosts === "loading" ? <small>Loading...</small>
                                                :
                                                responseStatusGetAllPosts === "error" ? <small>Error</small>
                                                    :
                                                    responseStatusGetAllPosts === "success" ? <small>OK</small>
                                                        :
                                                        <></>
                                        } */}
                                </div>
                            </div>
                        </div>



                        <div id="scrollbar-small" className="d-flex justify-content-center" style={{ overflow: "scroll", maxHeight: "800px", width: "auto", maxWidth: "auto", overflowX: "auto" }}>



                            <table id="table" className="container-fluid">

                                <tbody>





                                </tbody>

                            </table>
                        </div>







                    </div>

                </div>

            </div>

        </div>
    )
}

export default UserProfile;