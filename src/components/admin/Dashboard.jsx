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

// Admin View
import Posts from "./Posts.jsx";

//import UserPasswordRecover from './UserPasswordRecover.jsx';



function Dashboard() {

    // actual User (admin only)
    const [user, setUser] = useState(
        {
            fullName: null,
            email: null,
            username: null,
            role: null,
        }
    )

    // all users
    const [users, setUsers] = useState([]);

    // http response status
    const [responseStatusGeUserDetails, setResponseStatusGetUserDetails] = useState("");
    const [responseStatusGetAllUsers, setResponseStatusGetAllUsers] = useState("");



    useEffect(() => {

        //checkAuth();
        getUserDetails();
    }, []);

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
                });

            }

        }).catch(err => {
            setResponseStatusGetUserDetails("error");
            //Logout();
            return;
        })

    }


    const getAllUsers = async () => {

        setResponseStatusGetAllUsers("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        await axios.get(`${url}/user/all`, config).then((res) => {

            if (res.status === 200) {
                setResponseStatusGetAllUsers("success");
                //console.log(res.data);
                setUsers(res.data);
            }

        }).catch(err => {
            setResponseStatusGetAllUsers("error");
            //Logout();
            return;
        })
    }


    return (


        <div className="container-fluid">

            <div className="row">

                <div className="col-xl-4 mb-3">

                    <div className="card mb-3">
                        <div className="row g-0">
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{user?.fullName}</h5>
                                    <p className="card-text"><small>@{user?.username}</small></p>
                                    <p className="card-text"><small>{user?.email}</small></p>
                                    <p className="card-text"><small className="text-body-secondary">{user?.role}</small></p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="col-xl-4 mb-3">

                    <div className="card">
                        <div className="card-body">
                            card 2
                        </div>

                    </div>

                </div>

                <div className="col-xl-4 mb-3">

                    <div className="card">
                        <div className="card-body">
                            card 3
                        </div>

                    </div>

                </div>

            </div>


            <div className="row">

                <div className="col-xl-6 mb-3">

                    <div className="card">
                        <div className="card-body">
                            card 1
                        </div>

                    </div>

                </div>

                <div className="col-xl-6 mb-3">

                    <div className="card">
                        <div className="card-body">
                            <Posts />
                        </div>

                    </div>

                </div>

            </div>
        </div>






    )
}

export default Dashboard;