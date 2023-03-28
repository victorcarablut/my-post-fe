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


// Notifications
import toast from 'react-hot-toast';


function Post() {

    const [userId, setUserId] = useState(null);

    const [postTitle, setPostTitle] = useState(null);
    const [postDescription, setPostDescription] = useState(null);
    const [postImage, setPostImage] = useState(null);
    const [postImagePreview, setPostImagePreview] = useState(null);

    // list
    const [posts, setPosts] = useState([]);

    // inputs check validity
    const [handleInputPostTitleIsValid, setHandleInputPostTitleIsValid] = useState(false);
    const [handleInputPostDescriptionIsValid, setHandleInputPostDescriptionIsValid] = useState(false);

    // add CSS className
    const [handleInputPostTitleClassName, setHandleInputPostTitleClassName] = useState(null);
    const [handleInputPostDescriptionClassName, setHandleInputPostDescriptionClassName] = useState(null);

    const [buttonCreatePostIsDisabled, setButtonCreatePostIsDisabled] = useState(false);

    // http response status
    const [responseStatusGetAllPosts, setResponseStatusGetAllPosts] = useState("");

    useEffect(() => {
        getAllPosts();
        getUserDetails();
    }, [])

    // clear/reset inputs, other...
    const clearInputs = () => {
        setPostTitle(null);
        setPostDescription(null);

        setHandleInputPostTitleClassName(null);
        setHandleInputPostDescriptionClassName(null);

        setHandleInputPostTitleIsValid(false);
        setHandleInputPostDescriptionIsValid(false);

        setButtonCreatePostIsDisabled(false);

        setResponseStatusGetAllPosts("");
    }

    const handleInputPostImage = (e) => {
        if (e.target.files) {
            setPostImage(e.target.files[0]);
            setPostImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    }

    const deletePostImagePreview = () => {
        setPostImagePreview(null);
        setPostImage(null);
    }


    const getUserDetails = async () => {

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }

        }

        await axios.get(`${url}/user/details`, config).then((res) => {
            if (res.status === 200) {
                setUserId(res.data.id);
                console.log(res.data.id);
            }

        }).catch(err => {
            return;
        })

    }

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
                console.log(res.data);
                setPosts(res.data);
            }

        }).catch(err => {
            setResponseStatusGetAllPosts("error");
            //Logout();
            return;
        })

    }


    const handleInputPostTitle = async (e) => {

        const title = e.target.value;
        setPostTitle(title);

        if (title.length > 100) {
            setHandleInputPostTitleIsValid(false);
        } else if (title.length === 0) {
            setHandleInputPostTitleClassName(null);
        } else {
            setHandleInputPostTitleIsValid(true);
        }
    }

    const handleInputPostDescription = async (e) => {

        const description = e.target.value;
        setPostDescription(description);

        if (description.length > 500) {
            setHandleInputPostDescriptionIsValid(false);
        } else if (description.length === 0) {
            setHandleInputPostDescriptionClassName(null);
        } else {
            setHandleInputPostDescriptionIsValid(true);
        }
    }

    const checkAllInputsValidity = () => {

        if (handleInputPostTitle) {
            setHandleInputPostTitleClassName("is-valid");
        } else {
            setHandleInputPostTitleClassName("is-invalid");
        }

        if (handleInputPostDescription) {
            setHandleInputPostDescriptionClassName("is-valid");
        } else {
            setHandleInputPostDescriptionClassName("is-invalid");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    const createPost = async () => {

        checkAllInputsValidity();

        if (handleInputPostTitleIsValid) {

            setButtonCreatePostIsDisabled(true);

            const toastNotify = toast.loading("Waiting...");

            const jwt_token = secureLocalStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: "Bearer " + jwt_token,
                }
            }

            const formData = new FormData();
            //formData.append("data", data, {type: "application/json"});
            formData.append('data', new Blob([JSON.stringify({
                user: {
                    id: userId
                },
                title: postTitle,
                description: postDescription
            })], {
                type: "application/json"
            }));

            formData.append("image", postImage);

            await axios.post(`${url}/post/add`, formData, config).then((res) => {
                if (res.status === 200) {
                    setButtonCreatePostIsDisabled(false);

                    toast.dismiss(toastNotify);
                    toast.success("Published");

                    getAllPosts();

                    //uploadImage();
                }

            }).catch(err => {
                toast.dismiss(toastNotify);
                toast.error("Error");
                setButtonCreatePostIsDisabled(false);
                return;
            })

        } else {
            return;
        }
    }

    const uploadImage = async (postId) => {

        //checkAllInputsValidity();

        //setButtonCreatePostIsDisabled(true);

        //const toastNotify = toast.loading("Waiting...");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("post_id", postId);
        formData.append("image", postImage);

        await axios.post(`${url}/post/upload/image`, formData, config).then((res) => {
            if (res.status === 200) {
                //setButtonCreatePostIsDisabled(false);

                //toast.dismiss(toastNotify);
                //toast.success("Published");

                getAllPosts();
            }

        }).catch(err => {
            //toast.dismiss(toastNotify);
            //toast.error("Error");
            //setButtonCreatePostIsDisabled(false);
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
                                This is some text within a card body.
                                <form onSubmit={handleSubmit}>

                                    <div className="form-floating mb-3">
                                        <input type="text" className={"form-control " + handleInputPostTitleClassName} id="floatingInputPostTitle" placeholder="Title" onChange={(e) => handleInputPostTitle(e)} autoComplete="off" required />
                                        <label htmlFor="floatingInputPostTitle">Title</label>
                                        <div className="invalid-feedback">
                                            <small>...</small>
                                        </div>
                                    </div>

                                    {postImage &&
                                    <>
                                        <img src={postImagePreview} className="img-fluid rounded mb-3" alt="image" />
                                        <button type="button" className="btn btn-secondary btn-sm mb-3" onClick={deletePostImagePreview}>Delete Image</button>
                                        </>
                                    }

                                    <div className="container-fluid mb-3">
                                        <input type="file" className="form-control form-control-sm" name="postImage" accept="image/jpeg" onChange={(e) => handleInputPostImage(e)} />
                                        <small className="text-secondary">max: 10mb | .jpg</small>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <textarea type="text" className={"form-control " + handleInputPostDescriptionClassName} id="floatingInputPostDescription" placeholder="Description" onChange={(e) => handleInputPostDescription(e)} autoComplete="off" style={{ height: "100%", minHeight: "100px" }} />
                                        <label htmlFor="floatingInputPostDescription">Description</label>
                                        <div className="invalid-feedback">
                                            <small>...</small>
                                        </div>
                                    </div>

                                    <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!postTitle || buttonCreatePostIsDisabled} onClick={createPost}>Publish</button>
                                </form>
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
                                                                            <img src={post?.user?.userProfileImg ? `data:image/png;base64,${post.user.userProfileImg}` : default_user_profile_img} width="50" height="50" style={{ objectFit: "cover" }} alt="user-profile-img" className="position-absolute top-0 start-0 translate-middle rounded-circle border border-2 me-md-2" />
                                                                            <h6>{post?.user?.fullName}</h6>
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