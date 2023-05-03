import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../../config.js";

// Date Time Format (moment.js)
import moment from 'moment/min/moment-with-locales';
import { moment_locale, moment_format_date_time_long } from '../_resources/date-time/DateTime.js';

import default_user_profile_img from '../../assets/images/user.jpg';
import default_user_cover_img from '../../assets/images/cover.jpg';


// Notifications
import toast from 'react-hot-toast';
import { Empty, Error } from "../_resources/ui/Alerts.jsx";

function Users(props) {

    const navigate = useNavigate();

    // list
    const [users, setUsers] = useState([]);

    const [password, setPassword] = useState();

    const [filterUserStatus, setFilterUserStatus] = useState("all");

    // http response status
    const [responseStatusGetAllUsers, setResponseStatusGetAllUsers] = useState("");




    useEffect(() => {

        clearInputs();

        getAllUsers();

        // auto refresh - (start)
        const interval = setInterval(getAllUsers, 9000);

        return function () {

            // auto refresh - (stop)
            clearInterval(interval);
        };

    }, [filterUserStatus]);


    const clearInputs = () => {
        setPassword(null);
    }

    const handleInputPassword = async (e) => {
        const password = e.target.value;
        setPassword(password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    }


    const getAllUsers = async () => {

        setResponseStatusGetAllUsers("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        await axios.get(`${url}/user/all/admin`, config).then((res) => {

            if (res.status === 200) {
                setResponseStatusGetAllUsers("success");

                if (filterUserStatus === "regular") {

                    let newArr = [];

                    res.data.forEach((user) => {
                        if (user.status === "regular") {
                            newArr.push(user);
                        } else {
                            return;
                        }
                    })

                    setUsers(newArr);

                } else if (filterUserStatus === "warning") {

                    let newArr = [];

                    res.data.forEach((user) => {
                        if (user.status === "warning") {
                            newArr.push(user);
                        } else {
                            return;
                        }
                    })

                    setUsers(newArr);

                } else if (filterUserStatus === "blocked") {

                    getAllBlockedUsers();

                } else {
                    // all
                    setUsers(res.data);
                }
            }

        }).catch(err => {
            setResponseStatusGetAllUsers("error");
            return;
        })
    }

    const getAllBlockedUsers = async () => {

        setResponseStatusGetAllUsers("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        await axios.get(`${url}/user/all/blocked`, config).then((res) => {

            if (res.status === 200) {
                setResponseStatusGetAllUsers("success");
                setUsers(res.data);
            }

        }).catch(err => {
            setResponseStatusGetAllUsers("error");
            return;
        })
    }

    const handleFilterUserStatus = async (status) => {

        if (status === "regular") {
            setFilterUserStatus(status);
        } else if (status === "warning") {
            setFilterUserStatus(status);

        } else if (status === "blocked") {
            setFilterUserStatus(status);
        } else {
            // all
            setFilterUserStatus(status);
        }
        await getAllUsers();

    }

    const statusUser = async (userUsername, userStatus) => {

        const toastNotify = toast.loading("Loading...");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            userId: props.userId, // actual user id (admin)
            username: userUsername, // (of all users)
            status: userStatus
        }

        await axios.post(`${url}/user/status`, data, config).then((res) => {
            if (res.status === 200) {
                toast.dismiss(toastNotify);
                toast.success("Executed");

                getAllUsers();
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            return;
        })

    }

    const updateUserRole = async (userUsername, userStatus) => {

        const toastNotify = toast.loading("Waiting...");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            userId: props.userId, // actual user id (admin)
            username: userUsername, // (of all users)
            password: password, // for security reasons password is required
        }

        await axios.post(`${url}/user/role`, data, config).then((res) => {
            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error");

                } else if (res.data.status_code === 9) {
                    toast.dismiss(toastNotify);
                    toast.error("Error Password");

                } else {
                    toast.dismiss(toastNotify);
                    toast.success("Executed");

                    clearInputs();
                    getAllUsers();
                }

            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            return;
        })

    }

    // Custom  method for filter/search
    const searchMethod = () => {

        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("search-user-input");
        filter = input.value.toUpperCase();
        table = document.getElementById("table-users");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    // call the search method
    const searchUsers = () => {
        document.querySelector('#search-user-input').addEventListener('keyup', searchMethod, false);
    }

    return (
        <div>

            <div className="d-flex justify-content-center">

                <div className="position-relative">
                    <div className="position-absolute top-0 start-0">
                        {responseStatusGetAllUsers === "loading" &&
                            <div className="spinner-border spinner-border-sm text-light" style={{ marginLeft: 10 }} role="status" />
                        }
                    </div>
                </div>

                <div className="card container-fluid shadow" style={{ maxWidth: 600, minHeight: 120 }}>
                    <div className="card-body">

                        {(responseStatusGetAllUsers !== "error") &&
                            <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-3">
                                <small className="me-md-2">{users?.length} - Users - Filter by:</small>
                                <button type="button" className={"btn " + (filterUserStatus === "all" ? "btn-secondary" : "btn-outline-secondary") + " btn-sm"} disabled={filterUserStatus === "all"} onClick={() => handleFilterUserStatus("all")}>All</button>
                                <button type="button" className={"btn " + (filterUserStatus === "regular" ? "btn-success" : "btn-outline-success") + " btn-sm"} disabled={filterUserStatus === "regular"} onClick={() => handleFilterUserStatus("regular")}>Regular</button>
                                <button type="button" className={"btn " + (filterUserStatus === "warning" ? "btn-warning" : "btn-outline-warning") + " btn-sm"} disabled={filterUserStatus === "warning"} onClick={() => handleFilterUserStatus("warning")}>Warning</button>
                                <button type="button" className={"btn " + (filterUserStatus === "blocked" ? "btn-danger" : "btn-outline-danger") + " btn-sm"} disabled={filterUserStatus === "blocked"} onClick={() => handleFilterUserStatus("blocked")}>Blocked</button>
                            </div>
                        }

                        {(users?.length !== 0 && responseStatusGetAllUsers !== "error") &&
                            <input type="text" id="search-user-input" className="form-control search-user-input" onKeyUp={searchUsers} placeholder="Search..." autoComplete="off" />
                        }

                        {responseStatusGetAllUsers === "error" && <Error />}
                        {(users?.length === 0 && responseStatusGetAllUsers === "success") && <Empty />}

                    </div>
                </div>
            </div>



            {users?.length !== 0 &&


                <div id="scrollbar-small" className="d-flex justify-content-center" style={{ overflow: "scroll", maxHeight: "1000px", width: "auto", maxWidth: "auto", overflowX: "auto" }}>



                    <table id="table-users" className="container-fluid">

                        <tbody>

                            {users?.map(user =>



                                <tr key={user.id}>
                                    <td>

                                        <div className="card container-fluid animate__animated animate__fadeIn shadow-sm" style={{ maxWidth: 500, marginTop: 50 }}>



                                            <div className="position-relative">
                                                {user.status === "regular" ?
                                                    <div className="position-absolute top-0 start-50 translate-middle">
                                                        <span className="badge rounded-pill bg-success border border-secondary">Regular</span>
                                                    </div>
                                                    :
                                                    user.status === "warning" ?
                                                        <div className="position-absolute top-0 start-50 translate-middle">
                                                            <span className="badge rounded-pill bg-warning text-dark border border-secondary">Warning</span>
                                                        </div>
                                                        :
                                                      
                                                            user.blockedDate ?
                                                                <div className="position-absolute top-0 start-50 translate-middle">
                                                                    <span className="badge rounded-pill bg-danger border border-secondary">Blocked</span>
                                                                </div>
                                                                :
                                                                <div className="position-absolute top-0 start-50 translate-middle">
                                                                    <span className="badge rounded-pill bg-secondary border border-secondary">Not Verified</span>
                                                                </div>

                                                }
                                            </div>


                                            <br /><br />

                                            {(user.status === "regular" || user.status === "warning") &&
                                                <img src={user.userCoverImg ? `data:image/jpg;base64,${user.userCoverImg}` : default_user_cover_img} height="100" style={{ objectFit: "cover" }} className="card-img-top rounded" alt="user-cover" />
                                            }


                                            <div className="card-header bg-transparent">
                                                {(user.status === "regular" || user.status === "warning") ?
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                                        <img src={user.userProfileImg ? `data:image/jpg;base64,${user.userProfileImg}` : default_user_profile_img} width="60" height="60" style={{ objectFit: "cover", cursor: 'pointer', marginTop: -30 }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" onClick={() => navigate("/user/" + user.username)} />
                                                        <h6>{user.fullName} <span className="badge bg-secondary">{user.role}</span></h6>
                                                    </div>

                                                    :
                                                    user.blockedDate ?
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                                        <img src={default_user_profile_img} width="60" height="60" style={{ objectFit: "cover", marginTop: -30 }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" />
                                                        <h6>{user.fullName} <span className="badge bg-secondary">Deleted</span></h6>
                                                    </div>
                                                    :
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                                        <img src={default_user_profile_img} width="60" height="60" style={{ objectFit: "cover", marginTop: -30 }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" />
                                                        <h6>{user.fullName} <span className="badge bg-secondary">{user.role}</span></h6>
                                                    </div>
                                                }

                                                {(user.role === "ADMIN") &&
                                                    <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-primary border border-secondary">
                                                        admin
                                                    </span>}


                                                <div className="position-absolute top-0 end-0">
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">

                                                        {(user.status === "warning" || user.status === "blocked") &&

                                                            <div className="dropdown">
                                                                <button className="btn btn-light btn-sm dropdown-toggle" style={{ margin: 5 }} type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled={user.role === "ADMIN"}><i className="bi bi-check-circle text-success"></i> Regular</button>
                                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                    <p><small className="text-secondary">Are you sure?</small></p>
                                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={() => statusUser(user.username, "regular")}>Yes</button>
                                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                                </ul>
                                                            </div>
                                                        }



                                                        {(user.status === "regular" || user.status === "blocked") &&
                                                            <div className="dropdown">
                                                                <button className="btn btn-light btn-sm dropdown-toggle" style={{ margin: 5 }} type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled={user.role === "ADMIN" || user.enabled === false}><i className="bi bi-exclamation-triangle text-warning"></i> Warning</button>
                                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                    <p><small className="text-secondary">Are you sure?</small></p>
                                                                    <p><small className="text-secondary">Only a warning status</small></p>
                                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={() => statusUser(user.username, "warning")}>Yes</button>
                                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                                </ul>
                                                            </div>
                                                        }

                                                        {(user.status === "warning" || user.status === "regular") &&
                                                            <div className="dropdown">
                                                                <button className="btn btn-light btn-sm dropdown-toggle" style={{ margin: 5 }} type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled={user.role === "ADMIN" || user.enabled === false}><i className="bi bi-x-lg text-danger"></i> Block</button>
                                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                    <p><small className="text-secondary">Are you sure?</small></p>
                                                                    <p><small className="text-danger">Block and Delete User</small></p>
                                                                    <p><small className="text-secondary">All data will be deleted permanently</small></p>
                                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={() => statusUser(user.username, "blocked")}>Yes</button>
                                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                                </ul>
                                                            </div>
                                                        }

                                                        {(user.status === "regular") &&
                                                            <div className="dropdown">
                                                                <button className="btn btn-primary btn-sm dropdown-toggle position-absolute top-0 start-100 translate-middle" style={{ margin: 5 }} type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled={user.role === "ADMIN" || user.enabled === false}><i className="bi bi-person-fill-gear"></i></button>
                                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                    <p><small className="text-secondary">Are you sure?</small></p>
                                                                    <p><small className="text-secondary">User role will be changed to ADMIN</small></p>
                                                                    <form onSubmit={handleSubmit} style={{ minWidth: 200 }}>
                                                                        <li className="container-fluid mb-3">
                                                                            <input type="password" className="form-control form-control-sm mb-3" placeholder="Password" onChange={(e) => handleInputPassword(e)} autoComplete="off" required />
                                                                        </li>

                                                                    </form>
                                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" disabled={!password} onClick={() => updateUserRole(user.username)}>Yes</button>
                                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                                </ul>
                                                            </div>
                                                        }


                                                    </div>

                                                </div>


                                            </div>
                                            <div className="card-body">

                                                {(user.status === "regular" || user.status === "warning" || user.status === null) ?
                                                    <>
                                                        <ul className="list-group list-group-flush">
                                                            <li className="list-group-item"><small style={{ fontSize: 12 }}>id: #{user.id}</small> / <small style={{ fontSize: 12 }}>{user.enabled ? "enabled - (email verified)" : "disabled -  (email not verified yet)"}</small></li>
                                                            <li className="list-group-item"><small style={{ fontSize: 12 }}>@{user.username}</small></li>
                                                            <li className="list-group-item"><small style={{ fontSize: 12 }}>{user.email}</small></li>
                                                        </ul>

                                                        <div className="position-absolute bottom-0 end-0 text-muted" style={{ padding: "5px", fontSize: 12 }}>

                                                            {user.updatedDate ?

                                                                <small>updated: {moment(user.updatedDate).locale(moment_locale).format(moment_format_date_time_long)}</small>
                                                                :
                                                                <small>{moment(user.registeredDate).locale(moment_locale).format(moment_format_date_time_long)}</small>
                                                            }
                                                        </div>

                                                    </>

                                                    :
                                                    user.blockedDate ?

                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item"><small style={{ fontSize: 12 }}>@{user.username}</small></li>
                                                        <li className="list-group-item"><small style={{ fontSize: 12 }}>{user.email}</small></li>
                                                        <li className="list-group-item"><small>registered: {moment(user.registeredDate).locale(moment_locale).format(moment_format_date_time_long)}</small></li>
                                                        <li className="list-group-item"><small>blocked: {moment(user.blockedDate).locale(moment_locale).format(moment_format_date_time_long)}</small></li>
                                                    </ul>

                                                    :
                                                    <></>

                                                }


                                            </div>

                                            {(user.status === "regular" || user.status === "warning") &&
                                                <div className="card-footer bg-transparent text-muted">
                                                    <button type="button" className="btn btn-light btn-sm rounded-pill" onClick={() => navigate("/user/" + user.username)}><i className="bi bi-person-fill"></i> Profile <i className="bi bi-arrow-right-short"></i></button>
                                                </div>
                                            }

                                        </div>
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>
                </div>


            }
        </div>
    )
}

export default Users;