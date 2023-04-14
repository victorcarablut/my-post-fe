import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../config.js";

// Link 
import { NavLink, useNavigate } from 'react-router-dom';

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


function Post(props) {

    const navigate = useNavigate();

    const [userId, setUserId] = useState(null);
    const [postId, setPostId] = useState(null);
    const [username, setUsername] = useState(null);

    const [postTitle, setPostTitle] = useState(null);
    const [postDescription, setPostDescription] = useState(null);
    const [postImage, setPostImage] = useState(null);
    const [postImagePreview, setPostImagePreview] = useState(null);

    // new data
    const [postTitleNew, setPostTitleNew] = useState(null);
    const [postDescriptionNew, setPostDescriptionNew] = useState(null);
    const [postImageNew, setPostImageNew] = useState(null);
    const [postImagePreviewNew, setPostImagePreviewNew] = useState(null);
    const [postImagePreviewNewTemporary, setPostImagePreviewNewTemporary] = useState(null);

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

    const [likeButtonClassName, setLikeButtonClassName] = useState("text-primary");

    // auto refresh
    let interval = null;


    useEffect(() => {
        getUserDetails();
        //getAllPosts();

        // auto refresh
        interval = setInterval(getAllPosts, 5000);  // 5000 - 5 sec

        // examples: 
        // 1000 // 1 sec <- time in ms
        // 10000 // 10 sec <- time in ms
        // 15000 // 15 sec <- time in ms
        // 1000 * 60 * 50 // 50 min 
        // 1000 * 60 * 20 // 20 min

        return function () {

            // auto refresh
            stopInterval();
        };

    }, [props.filter])

    // auto refresh
    const stopInterval = () => {
        clearInterval(interval);
    }

    // clear/reset inputs, other...
    const clearInputs = () => {

        setPostId(null);

        setPostTitle(null);
        setPostDescription(null);

        setPostTitleNew(null);
        setPostDescriptionNew(null);

        //deletePostImagePreview();
        setPostImage(null);
        deletePostImagePreviewNew();

        setHandleInputPostTitleClassName(null);
        setHandleInputPostDescriptionClassName(null);

        setHandleInputPostTitleIsValid(false);
        setHandleInputPostDescriptionIsValid(false);

        setButtonCreatePostIsDisabled(false);

        setResponseStatusGetAllPosts("");

    }

    const handleInputPostImage = (e) => {
        //setPostImagePreviewShow(true);

        //setPostImagePreviewShow(true); 

        //setPostImagePreviewShow(!postImagePreviewShow); 

        //console.log(postImagePreview);
        //setPostImage(null);
        //setPostImagePreview(true);

        if (e.target.files) {
            setPostImage(e.target.files[0]);
            setPostImagePreview(URL.createObjectURL(e.target.files[0]));
            //setPostImagePreviewShow(true);
            // important: reset the value to prevent no visible data uploading the same image file twice
            e.target.value = null
        } else {
            setPostImage(null);
        }
    }

    const handleInputPostImageNew = (e) => {

        if (e.target.files) {
            setPostImagePreviewNewTemporary(null);
            setPostImageNew(e.target.files[0]);
            setPostImagePreviewNew(URL.createObjectURL(e.target.files[0]));
            // important: reset the value...
            e.target.value = null

        } else {
            setPostImageNew(null);
        }
    }

    const deletePostImagePreview = () => {
        //setPostImagePreview(null);
        //setPostImagePreviewShow(false);
        //setPostImage(null);
    }

    const deletePostImagePreviewNew = () => {
        setPostImagePreviewNew(null);
        //setPostImagePreviewNew(URL.createObjectURL(null));
        setPostImageNew(null);
        setPostImagePreviewNewTemporary(null);
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
                setUsername(res.data.username);

                getAllPosts();
            }

        }).catch(err => {
            return;
        })

    }

    const getAllPosts = async () => {

        //console.log("load 1 time");

        setResponseStatusGetAllPosts("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        console.log(props.filter);

        //await axios.get(`${url}/post/all/${props.filter}`, config).then((res) => {

        await axios.get(`${url}/post/all/${props.filter}`, config).then((res) => {

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

    const handleInputPostTitleNew = async (e) => {

        const title = e.target.value;
        setPostTitleNew(title);

        /*  if (title.length > 100) {
             setHandleInputPostTitleIsValid(false);
         } else if (title.length === 0) {
             setHandleInputPostTitleClassName(null);
         } else {
             setHandleInputPostTitleIsValid(true);
         } */
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

    const handleInputPostDescriptionNew = async (e) => {

        const description = e.target.value;
        setPostDescriptionNew(description);

        /* if (description.length > 500) {
            setHandleInputPostDescriptionIsValid(false);
        } else if (description.length === 0) {
            setHandleInputPostDescriptionClassName(null);
        } else {
            setHandleInputPostDescriptionIsValid(true);
        } */
    }

    const passPostDataUpdateNew = (id, title, description, image) => {
        setPostId(id);
        setPostTitleNew(title);
        setPostDescriptionNew(description);
        setPostImagePreviewNewTemporary(image);
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

                    clearInputs();

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


    const updatePost = async () => {

        const toastNotify = toast.loading("Waiting...");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }
        //console.log(postTitleNew);
        //console.log(postDescriptionNew);
        //console.log(postImageNew);

        const formData = new FormData();
        //formData.append("data", data, {type: "application/json"});
        formData.append('post_id', new Blob([JSON.stringify({
            post_id: postId
        })], {
            type: "application/json"
        }));

        formData.append('data', new Blob([JSON.stringify({
            user: {
                id: userId
            },
            title: postTitleNew,
            description: postDescriptionNew
        })], {
            type: "application/json"
        }));

        formData.append("image", postImageNew);

        formData.append('image_status', new Blob([JSON.stringify({
            image_status: postImageNew || postImagePreviewNewTemporary ? "ok" : "no-image"
        })], {
            type: "application/json"
        }));

        await axios.put(`${url}/post/update`, formData, config).then((res) => {
            if (res.status === 200) {

                if (res.data.status_code === 1) {
                    toast.dismiss(toastNotify);
                    toast.error("Error"); // Error save data to DB
                    //setEmailNewCodeStatus("error");
                    //setButtonSendEmailCodeIsDisabled(false);
                } else {
                    setButtonCreatePostIsDisabled(false);


                    toast.dismiss(toastNotify);
                    toast.success("Updated");

                    document.getElementById('button-modal-update-post-close').click();
                    clearInputs();

                    getAllPosts();

                    //uploadImage();
                }


            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            setButtonCreatePostIsDisabled(false);
            return;
        })


    }

    const deletePost = async (postId) => {

        const toastNotify = toast.loading("Waiting...");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        console.log("user_id: " + userId);
        console.log("post_id: " + postId);

        const data = {
            user_id: userId,
            post_id: postId
        }

        await axios.post(`${url}/post/delete`, data, config).then((res) => {
            if (res.status === 200) {
                //setButtonCreatePostIsDisabled(false);

                toast.dismiss(toastNotify);
                toast.success("Deleted");

                getAllPosts();
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
            //setButtonCreatePostIsDisabled(false);
            return;
        })

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

    // ------ Like ------

    const postLike = async (postId) => {

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        const data = {
            post: {
                id: postId
            },
            user: {
                id: userId
            }
        }

        await axios.post(`${url}/post/like`, data, config).then((res) => {
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

        <>
            <div className="container-fluid">

                <div className="row">

                    <div className="col-xl-6" style={{ paddingBottom: 20 }}>

                        {props.filter}
                        <br/>
                        {username} 

                        {(username === props.filter || props.filter === "all") &&



                            <div className="d-flex justify-content-center mb-3">
                                <div className="card container-fluid shadow" style={{ maxWidth: 500 }}>
                                    <div className="card-body">
                                        <h6>Create Post</h6>

                                        <form onSubmit={handleSubmit}>

                                            <div className="form-floating mb-3">
                                                <input type="text" className={"form-control " + handleInputPostTitleClassName} id="floatingInputPostTitle" placeholder="Title" value={postTitle || ""} maxLength="100" onChange={(e) => handleInputPostTitle(e)} autoComplete="off" required />
                                                <label htmlFor="floatingInputPostTitle">Title</label>
                                                <div className="invalid-feedback">
                                                    <small>...</small>
                                                </div>
                                            </div>

                                            {postImage ?
                                                <>
                                                    <button type="button" className="btn-close mb-3" aria-label="Close" onClick={(e) => setPostImage(null)}></button>
                                                    <img src={postImagePreview} className="img-fluid rounded mb-3" alt="image" />
                                                </>

                                                :

                                                <div className="mb-3">
                                                    <p><small>no image selected</small></p>

                                                    <input type="file" className="form-control form-control-sm" name="postImage" id="postImage" accept="image/jpeg" style={{ color: "red", display: 'none' }} onChange={(e) => handleInputPostImage(e)} />

                                                    <label htmlFor="postImage" className="btn btn-secondary btn-sm me-md-2">Upload Image</label>
                                                    <small className="text-secondary"> max: 10mb / .jpg</small>
                                                </div>


                                            }



                                            <div className="form-floating mb-3">
                                                <textarea type="text" className={"form-control " + handleInputPostDescriptionClassName} id="floatingInputPostDescription" placeholder="Description" value={postDescription || ""} maxLength="500" onChange={(e) => handleInputPostDescription(e)} autoComplete="off" style={{ height: "100%", minHeight: "100px" }} />
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

                        }

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


                            {(posts?.length === 0 && responseStatusGetAllPosts !== "error") ? <small>Empty Data</small>
                                :

                                <div id="scrollbar-small" className="d-flex justify-content-center" style={{ overflow: "scroll", maxHeight: "900px", width: "auto", maxWidth: "auto", overflowX: "auto" }}>



                                    <table id="table" className="container-fluid">

                                        <tbody>

                                            {posts?.map(post =>



                                                <tr key={post.id}>
                                                    <td>

                                                        <div className="card container-fluid animate__animated animate__fadeIn shadow-sm" style={{ maxWidth: 500, marginTop: 50 }}>
                                                            <div className="card-header bg-transparent">
                                                                <img src={post?.user?.userProfileImg ? `data:image/png;base64,${post.user.userProfileImg}` : default_user_profile_img} width="50" height="50" style={{ objectFit: "cover", cursor: 'pointer' }} alt="user-profile-img" className="position-absolute top-0 start-0 translate-middle rounded-circle border border-2 me-md-2" onClick={() => navigate("/user/" + post?.user.username)} />
                                                                <h6>{post?.user?.fullName}</h6>


                                                                {
                                                                    userId === post?.user?.id &&
                                                                    <div className="position-absolute top-0 end-0">
                                                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                                            <button type="button" className="btn btn-light btn-sm" style={{ margin: 5 }} data-bs-toggle="modal" data-bs-target="#editPostModal" onClick={() => passPostDataUpdateNew(post.id, post.title, post.description, post.image)} ><i className="bi bi-pencil-square"></i></button>
                                                                            <div className="dropdown">
                                                                                <button className="btn btn-light btn-sm dropdown-toggle" style={{ margin: 5 }} type="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-x-lg text-danger"></i></button>
                                                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start text-center shadow-lg">
                                                                                    <p><small className="text-secondary">Delete Post?</small></p>
                                                                                    <button className="btn btn-secondary btn-sm me-md-2" type="button" onClick={() => deletePost(post.id)}>Yes</button>
                                                                                    <button className="btn btn-secondary btn-sm" type="button">No</button>
                                                                                </ul>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                }

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








                                                                <div className="btn-group dropup">






                                                                    <button type="button" className="btn btn-light rounded-pill btn-sm me-md-2" onClick={() => postLike(post.id)}>

                                                                        <i className="bi bi-hand-thumbs-up me-md-2"></i>



                                                                        {/* {post.likes?.map(like => like.userId === userId &&
                                                                                <i className="bi bi-hand-thumbs-up-fill text-primary me-md-2"></i>)
                                                                            } */}
                                                                        {post.likes?.map(like => like.userId === userId &&

                                                                            <small className="text-primary me-md-2" key={like.likeId}>Liked</small>
                                                                        )
                                                                        }

                                                                        <small>{post.likes.length}</small>

                                                                    </button>



                                                                    {post?.likes.length !== 0 &&
                                                                        <button type="button" className="btn btn-sm btn-light rounded-pill dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" />}


                                                                    <ul className="dropdown-menu">

                                                                        {
                                                                            post.likes?.map(like =>
                                                                                <ul className="list-group list-group-flush" key={like.likeId}>
                                                                                    <li className="list-group-item list-group-item-action" style={{ cursor: 'pointer' }} onClick={() => navigate("/user/" + like.username)}>{like.userId === userId ? <small className="text-primary">{like.userFullName}</small> : <small>{like.userFullName}</small>}</li>
                                                                                </ul>
                                                                            )
                                                                        }

                                                                    </ul>

                                                                </div>

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

                    </div>

                </div>

            </div>

            {/* --- Modal (Edit Post) --- */}
            <div className="modal fade" id="editPostModal" tabIndex="-1" aria-labelledby="editPostModalLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editPostModalLabel">Edit Post</h1>
                            <button type="button" className="btn-close btn-close-white" id='button-modal-update-post-close' data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <form onSubmit={handleSubmit}>

                                <div className="form-floating mb-3">
                                    <input type="text" className={"form-control"} id="floatingInputPostTitleNew" placeholder="Title *" value={postTitleNew || ""} maxLength="100" onChange={(e) => handleInputPostTitleNew(e)} autoComplete="off" required />
                                    <label htmlFor="floatingInputPostTitleNew">Title *</label>
                                    <div className="invalid-feedback">
                                        <small>...</small>
                                    </div>
                                    {postTitleNew?.length === 0 && <p><small>required *</small></p>}
                                </div>

                                {postImagePreviewNewTemporary &&
                                    <>
                                        <button type="button" className="btn-close mb-3" aria-label="Close" onClick={(e) => setPostImagePreviewNewTemporary(null)}></button>
                                        <img src={`data:image/png;base64,${postImagePreviewNewTemporary}`} className="img-fluid rounded mb-3" alt="image" />
                                    </>
                                }

                                {postImageNew &&
                                    <>
                                        <button type="button" className="btn-close mb-3" aria-label="Close" onClick={(e) => setPostImageNew(null)}></button>
                                        <img src={postImagePreviewNew} className="img-fluid rounded mb-3" alt="image" />

                                    </>

                                }

                                {
                                    (!postImageNew && !postImagePreviewNewTemporary) &&

                                    <div className="mb-3">
                                        <p><small>no image selected</small></p>
                                        <input type="file" className="form-control form-control-sm" name="postImageNew" id="postImageNew" accept="image/jpeg" style={{ color: "red", display: 'none' }} onChange={(e) => handleInputPostImageNew(e)} />

                                        <label htmlFor="postImageNew" className="btn btn-secondary btn-sm me-md-2">Upload Image</label>
                                        <small className="text-secondary"> max: 10mb / .jpg</small>

                                    </div>
                                }



                                {/*  {postImagePreviewNewTemporary &&
                                    <div>
                                        <button type="button" className="btn-secondary btn-sm mb-3" onClick={deletePostImagePreviewNew}>Delete Image</button>
                                    </div>
                                } */}


                                <div className="form-floating mb-3">
                                    <textarea type="text" className={"form-control"} id="floatingInputPostDescriptionNew" placeholder="Description" value={postDescriptionNew || ""} maxLength="500" onChange={(e) => handleInputPostDescriptionNew(e)} autoComplete="off" style={{ height: "100%", minHeight: "100px" }} />
                                    <label htmlFor="floatingInputPostDescriptionNew">Description</label>
                                    <div className="invalid-feedback">
                                        <small>...</small>
                                    </div>
                                </div>
                                <button className="btn btn-secondary btn-sm rounded-pill shadow fw-semibold mb-3" style={{ paddingLeft: 15, paddingRight: 15 }} disabled={!postTitleNew} onClick={updatePost}>Update</button>
                            </form>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary btn-sm rounded-pill shadow" id='button-modal-submit-delete-employee-close' data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}

export default Post;