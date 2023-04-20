import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

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


// Notifications
import toast from 'react-hot-toast';

function Posts(props) {

    const navigate = useNavigate();

    // list
    const [posts, setPosts] = useState([]);

    const [filterPostStatus, setFilterPostStatus] = useState("pending");

    // http response status
    const [responseStatusGetAllPosts, setResponseStatusGetAllPosts] = useState("");

    useEffect(() => {

        //checkAuth();

        getAllPosts();

    }, [props.userId, filterPostStatus]);

    const getAllPosts = async () => {

        //console.log("load 1 time");

        setResponseStatusGetAllPosts("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const role = "admin";


        //await axios.get(`${url}/post/all/${props.filter}`, config).then((res) => {

        await axios.get(`${url}/post/all/${role}`, config).then((res) => {

            if (res.status === 200) {
                setResponseStatusGetAllPosts("success");
                //console.log(res.data);

                //setPosts(res.data);

                if (filterPostStatus === "active") {

                    // clear Array
                    setPosts([]);

                    let newArr = [];

                    res.data.forEach((post) => {
                        if (post.status === "active") {
                            newArr.push(post);
                        } else {
                            return;
                        }
                    })

                    setPosts(newArr);

                } else if (filterPostStatus === "pending") {

                    // clear Array
                    setPosts([]);

                    let newArr = [];

                    res.data.forEach((post) => {
                        if (post.status === "pending") {
                            newArr.push(post);
                        } else {
                            return;
                        }
                    })

                    // reverse order to see on the top from old posts to new
                    newArr.reverse();

                    setPosts(newArr);
                } else if (filterPostStatus === "blocked") {
                    // clear Array
                    setPosts([]);

                    let newArr = [];

                    res.data.forEach((post) => {
                        if (post.status === "blocked") {
                            newArr.push(post);
                        } else {
                            return;
                        }
                    })

                    setPosts(newArr);
                } else {
                    // all
                    setPosts(res.data);
                }



            }

        }).catch(err => {
            setResponseStatusGetAllPosts("error");
            //Logout();
            return;
        })

    }

    const handleFilterPostStatus = async (status) => {

        if(status === "active") {
            setFilterPostStatus(status);
        } else if(status === "pending") {
            setFilterPostStatus(status);
    
        } else if(status === "blocked") {
            setFilterPostStatus(status);
        } else {
            // all
            setFilterPostStatus(status);
        }
        await getAllPosts();

    }

    const statusPost = async (postId, postStatus) => {

        const toastNotify = toast.loading("Waiting...");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        //console.log("user_id: " + userId);
        //console.log("post_id: " + postId);

        const data = {
            userId: props.userId,
            postId: postId,
            status: postStatus
        }

        await axios.post(`${url}/post/status`, data, config).then((res) => {
            if (res.status === 200) {
                //setButtonCreatePostIsDisabled(false);

                toast.dismiss(toastNotify);
                toast.success("Executed");

                getAllPosts();
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            //setButtonCreatePostIsDisabled(false);
            return;
        })

    }

    return (
        <div>

            <div className="d-flex justify-content-center">
                <div className="card container-fluid shadow" style={{ maxWidth: 600 }}>
                    <div className="card-body">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                            <small className="me-md-2">Posts - Filter by:</small>
                            <button type="button" className={"btn " + (filterPostStatus === "all" ? "btn-secondary" : "btn-outline-secondary") + " btn-sm"} disabled={filterPostStatus === "all"} onClick={() => handleFilterPostStatus("all")}>All</button>
                            <button type="button" className={"btn " + (filterPostStatus === "active" ? "btn-success" : "btn-outline-success") + " btn-sm"} disabled={filterPostStatus === "active"} onClick={() => handleFilterPostStatus("active")}>Active</button>
                            <button type="button" className={"btn " + (filterPostStatus === "pending" ? "btn-warning" : "btn-outline-warning") + " btn-sm"} disabled={filterPostStatus === "pending"} onClick={() => handleFilterPostStatus("pending")}>Pending</button>
                            <button type="button" className={"btn " + (filterPostStatus === "blocked" ? "btn-danger" : "btn-outline-danger") + " btn-sm"} disabled={filterPostStatus === "blocked"} onClick={() => handleFilterPostStatus("blocked")}>Blocked</button>
                        </div>

                    </div>
                </div>
            </div>

            {(posts?.length === 0 && responseStatusGetAllPosts !== "error") ? <small>Empty Data</small>
                :

                <div id="scrollbar-small" className="d-flex justify-content-center" style={{ overflow: "scroll", maxHeight: "900px", width: "auto", maxWidth: "auto", overflowX: "auto" }}>



                    <table id="table" className="container-fluid">

                        <tbody>

                            {posts?.map(post =>



                                <tr key={post.id}>
                                    <td>

                                        <div className="card container-fluid animate__animated animate__fadeIn shadow-sm" style={{ maxWidth: 500, marginTop: 50 }}>



                                            <div className="position-relative">
                                                {post.status === "active" ?
                                                    <div className="position-absolute top-0 start-50 translate-middle">
                                                        <span className="badge rounded-pill bg-success border border-secondary">Active</span>
                                                    </div>
                                                    :
                                                    post.status === "pending" ?
                                                        <div className="position-absolute top-0 start-50 translate-middle">
                                                            <span className="badge rounded-pill bg-warning text-dark border border-secondary">Pending</span>
                                                        </div>
                                                        :
                                                        post.status === "blocked" ?
                                                            <div className="position-absolute top-0 start-50 translate-middle">
                                                                <span className="badge rounded-pill bg-danger border border-secondary">Blocked</span>
                                                            </div>
                                                            :
                                                            <div className="position-absolute top-0 start-50 translate-middle">
                                                                <span className="badge rounded-pill bg-secondary border border-secondary">not defined</span>
                                                            </div>
                                                }
                                            </div>



                                            <div className="card-header bg-transparent">
                                                <img src={post?.user?.userProfileImg ? `data:image/png;base64,${post.user.userProfileImg}` : default_user_profile_img} width="50" height="50" style={{ objectFit: "cover", cursor: 'pointer' }} alt="user-profile-img" className="position-absolute top-0 start-0 translate-middle rounded-circle border border-2 me-md-2" onClick={() => navigate("/user/" + post?.user.username)} />
                                                <h6>{post?.user?.fullName} <span className="badge bg-secondary">{post?.user.role}</span></h6>



                                                <div className="position-absolute top-0 end-0">
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">

                                                        {(post.status === "pending" || post.status === "blocked") &&

                                                            <div className="dropdown">
                                                                <button className="btn btn-light btn-sm dropdown-toggle" style={{ margin: 5 }} type="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-check-circle text-success"></i> Approve</button>
                                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                    <p><small className="text-secondary">Are you sure?</small></p>
                                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={() => statusPost(post.id, "active")}>Yes</button>
                                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                                </ul>
                                                            </div>



                                                        }

                                                        {(post.status === "pending" || post.status === "active") &&
                                                            <div className="dropdown">
                                                                <button className="btn btn-light btn-sm dropdown-toggle" style={{ margin: 5 }} type="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-x-lg text-danger"></i> Block</button>
                                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                    <p><small className="text-secondary">Are you sure?</small></p>
                                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={() => statusPost(post.id, "blocked")}>Yes</button>
                                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                                </ul>
                                                            </div>
                                                        }


                                                    </div>

                                                </div>


                                            </div>
                                            <div className="card-body">

                                                <p>{post.title}</p>
                                                {post.image &&
                                                    <img src={`data:image/jpeg;base64,${post.image}`} className="img-fluid rounded" alt="image" />
                                                }

                                                <small style={{ fontSize: 12 }}>{post.description}</small>

                                                <div className="position-absolute bottom-0 end-0 text-muted" style={{ padding: "5px", fontSize: 12 }}>

                                                    {post?.updatedDate ?

                                                        <small>updated: {moment(post.updatedDate).locale(moment_locale).format(moment_format_date_time_long)}</small>
                                                        :
                                                        <small>{moment(post.createdDate).locale(moment_locale).format(moment_format_date_time_long)}</small>
                                                    }
                                                </div>
                                            </div>
                                            <div className="card-footer bg-transparent text-muted">
                                                <small>Likes: {post.likes.length}</small>
                                            </div>
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

export default Posts;