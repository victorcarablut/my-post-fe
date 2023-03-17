import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../config.js";

// Link 
import { NavLink, Link, useNavigate } from 'react-router-dom';

//import { VerifyToken } from './security/VerifyToken.js';
import { Logout } from './account/Logout.js';

// Logo / User
//import logo from '../assets/images/logo.png';
//import user_pic_profile from '../assets/images/user.jpg';

import { LoadingFullScreen, LoadingSmall } from '../components/_resources/ui/Loadings';
import { Error } from './_resources/ui/Alerts.jsx';

// Date Time Format (moment.js)
import moment from 'moment/min/moment-with-locales';
import { moment_locale, moment_format_date_time_long } from './_resources/date-time/DateTime.js';
//import UserPasswordRecover from './UserPasswordRecover.jsx';

import default_user_profile_img from '../assets/images/user.jpg';

function Post() {

    const [posts, setPosts] = useState([]);

    // http response status
    const [responseStatusGetAllPosts, setResponseStatusGetAllPosts] = useState("");

    useEffect(() => {
        getAllPosts();
    }, [])

    const getAllPosts = async () => {

        setResponseStatusGetAllPosts("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        await axios.get(`${url}/post/all`, config).then((res) => {

            if (res.status === 200) {
                setResponseStatusGetAllPosts("success");

                //console.log(res.data);

                setPosts(res.data);


            }

        }).catch(err => {
            setResponseStatusGetAllPosts("error");
            //Logout();
            return;
        })

    }

    return (
        <div className="container-fluid">

            <div className="row">

                <div className="col-xl-5" style={{ paddingBottom: "20px" }}>

                    <div className="d-flex justify-content-center sticky-top">
                        <div className="card container-fluid shadow" style={{ maxWidth: 500 }}>
                            <div className="card-body">
                                This is some text within a card body.
                            </div>
                        </div>
                    </div>

                </div>



                <div className="col-xl-7" style={{ paddingBottom: "20px" }}>

                    <div>

                        {responseStatusGetAllPosts === "loading" ? <small>Loading...</small>
                            :
                            responseStatusGetAllPosts === "error" ? <small>Error</small>
                                :
                                responseStatusGetAllPosts === "success" ?

                                    <>
                                        <div className="d-flex justify-content-center">
                                            <div className="card container-fluid shadow" style={{ maxWidth: 600 }}>
                                                <div className="card-body">
                                                    This is some text within a card body.
                                                </div>
                                            </div>
                                        </div>


                                        {posts?.length === 0 ? <small>Empty Data</small>
                                            :

                                            <div id="scrollbar-small" className="d-flex justify-content-center" style={{ overflow: "scroll", maxHeight: "800px", width: "auto", maxWidth: "auto", overflowX: "auto" }}>



                                                <table id="table" className="container-fluid">

                                                    <tbody>

                                                        {posts?.map(post =>



                                                            <tr key={post.id}>
                                                                <td>

                                                                    <div className="card container-fluid animate__animated animate__fadeIn shadow-sm" style={{ maxWidth: 500, marginTop: 50 }}>
                                                                        <div className="card-header bg-transparent">
                                                                            <img src={post.user.userProfileImg ? `data:image/png;base64,${post.user.userProfileImg}` : default_user_profile_img} width="50" height="50" style={{ objectFit: "cover" }} alt="user-profile-img" className="position-absolute top-0 start-0 translate-middle rounded-circle border border-2 me-md-2" />
                                                                            <h6>{post.user.fullName}</h6>
                                                                        </div>
                                                                        <div className="card-body">

                                                                            <p>{post.title}</p>
                                                                            <small>{post.description}</small>

                                                                            <div className="position-absolute bottom-0 end-0" style={{ padding: "5px" }}>
                                                                                2023
                                                                            </div>
                                                                        </div>
                                                                        <div className="card-footer bg-transparent text-muted">
                                                                            card footer
                                                                        </div>
                                                                    </div>

                                                                </td>
                                                            </tr>



                                                        )}



                                                    </tbody>

                                                </table>
                                            </div>


                                        }

                                    </>
                                    :
                                    <></>

                        }
                    </div>

                </div>

            </div>

        </div>

    )
}

export default Post;