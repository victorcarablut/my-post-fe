import React, { useEffect, useState } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../config.js";

// Link 
import { Link, useNavigate } from 'react-router-dom';

import { Empty, Error } from './_resources/ui/Alerts.jsx';

// Date Time Format (moment.js)
import moment from 'moment/min/moment-with-locales';
import { moment_locale, moment_format_date_time_long } from './_resources/date-time/DateTime.js';

import default_user_profile_img from '../assets/images/user.jpg';

import Users from './Users.jsx';


// Notifications
import toast from 'react-hot-toast';


function Posts(props) {

    const navigate = useNavigate();


    const [postId, setPostId] = useState(null);

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

    const [likes, setLikes] = useState([]);

    // inputs check validity
    const [handleInputPostTitleIsValid, setHandleInputPostTitleIsValid] = useState(false);

    // add CSS className
    const [handleInputPostTitleClassName, setHandleInputPostTitleClassName] = useState(null);
    const [handleInputPostDescriptionClassName, setHandleInputPostDescriptionClassName] = useState(null);

    const [buttonCreatePostIsDisabled, setButtonCreatePostIsDisabled] = useState(false);

    // http response status
    const [responseStatusGetAllPosts, setResponseStatusGetAllPosts] = useState("");
    const [responseStatusGetAllPostsLikes, setResponseStatusGetAllPostsLikes] = useState("");


    useEffect(() => {

        getAllPosts();
        // auto refresh - (start)
        const interval = setInterval(getAllPosts, 10000);  // example: start loading after: 5000 - 5 sec

        return function () {
            // auto refresh - (stop)
            clearInterval(interval);
        }

    }, [props.filter])



    // clear/reset inputs, other...
    const clearInputs = () => {

        setPostId(null);

        setPostTitle(null);
        setPostDescription(null);

        setPostTitleNew(null);
        setPostDescriptionNew(null);

        setPostImage(null);
        deletePostImagePreviewNew();

        setHandleInputPostTitleClassName(null);
        setHandleInputPostDescriptionClassName(null);

        setHandleInputPostTitleIsValid(false);


        setButtonCreatePostIsDisabled(false);


        setResponseStatusGetAllPosts("");

    }

    const handleInputPostImage = (e) => {

        if (e.target.files) {
            setPostImage(e.target.files[0]);
            setPostImagePreview(URL.createObjectURL(e.target.files[0]));
            ;
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


    const deletePostImagePreviewNew = () => {
        setPostImagePreviewNew(null);
        setPostImageNew(null);
        setPostImagePreviewNewTemporary(null);
    }



    const getAllPosts = async () => {

        console.log("load");

        setResponseStatusGetAllPosts("loading");


        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }
        // {props.filter}
        const data = {
            filter: props.filter
        }

        await axios.post(`${url}/post/find`, data, config).then((res) => {

            if (res.status === 200) {
                setResponseStatusGetAllPosts("success");


                if (props.filter === "active") {

                    setPosts(res.data);

                } else {

                    // only the Owner of Posts can see active & non active in: > UserProfile

                    // condition to prevent other user to see "Pending" message on owners Post's in: > UserProfile

                    let newArr = [];

                    res.data.forEach((post) => {
                        if (post.user.id === props.userId) {
                            newArr.push(post);
                        } else if (post.user.id !== props.userId && post.status === "active") {
                            newArr.push(post);
                        } else {
                            return;
                        }
                    })

                    setPosts(newArr);
                }

 



            }

        }).catch(err => {
            setResponseStatusGetAllPosts("error");
      
            return;
        })

    }


    const getAllPostLikes = async (postId) => {

        setLikes([]);

        setResponseStatusGetAllPostsLikes("loading");

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }
        // {props.filter}
        const data = {
            postId: postId
        }

        await axios.post(`${url}/post/like/all`, data, config).then((res) => {

            if (res.status === 200) {
                setResponseStatusGetAllPostsLikes("success");

                setLikes(res.data);

            }

        }).catch(err => {
            setResponseStatusGetAllPostsLikes("error");
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
    }

    const handleInputPostDescription = async (e) => {

        const description = e.target.value;
        setPostDescription(description);
    }

    const handleInputPostDescriptionNew = async (e) => {

        const description = e.target.value;
        setPostDescriptionNew(description);
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
            formData.append('data', new Blob([JSON.stringify({
                user: {
                    id: props.userId,
                    email: props.userEmail
                },
                title: postTitle,
                description: postDescription
            })], {
                type: "application/json"
            }));

            formData.append("image", postImage);

            await axios.post(`${url}/post/add`, formData, config).then((res) => {
                if (res.status === 200) {

                    if (res.data.status_code === 1) {
                        toast.dismiss(toastNotify);
                        toast.error("Error"); // Error save data to DB

                    } else if (res.data.status_code === 4) {
                        toast.dismiss(toastNotify);
                        toast.error("Account with that email doesn't exist");

                    } else if (res.data.status_code === 11) {
                        toast.dismiss(toastNotify);
                        toast.error("You've reached maximum number of Posts");
                        setButtonCreatePostIsDisabled(false);

                    } else {
                        setButtonCreatePostIsDisabled(false);

                        toast.dismiss(toastNotify);
                        toast.success("Created");

                        clearInputs();

                        getAllPosts();

                        navigate("/user/" + props.username); // example:user will see a "pending" status

                    }



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


        const formData = new FormData();

        formData.append('post_id', new Blob([JSON.stringify({
            post_id: postId
        })], {
            type: "application/json"
        }));

        formData.append('data', new Blob([JSON.stringify({
            user: {
                id: props.userId
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

                } else {
                    setButtonCreatePostIsDisabled(false);

                    toast.dismiss(toastNotify);
                    toast.success("Updated");

                    document.getElementById('button-modal-update-post-close').click();
                    clearInputs();

                    getAllPosts();

                    // navigate("/user/" + username);



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

        const data = {
            user_id: props.userId,
            post_id: postId
        }

        await axios.post(`${url}/post/delete`, data, config).then((res) => {
            if (res.status === 200) {

                toast.dismiss(toastNotify);
                toast.success("Deleted");

                getAllPosts();
            }

        }).catch(err => {
            toast.dismiss(toastNotify);
            toast.error("Error");
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
                id: props.userId
            }
        }

        await axios.post(`${url}/post/like`, data, config).then((res) => {
            if (res.status === 200) {
                getAllPosts();
                // setButtonLikeIsDisabled(false); already in  getAllPosts();
            }

        }).catch(err => {

            return;
        })


    }


    // Custom  method for filter/search
    const searchMethod = () => {

        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("search-post-input");
        filter = input.value.toUpperCase();
        table = document.getElementById("table-posts");
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
    const searchPosts = () => {
        document.querySelector('#search-post-input').addEventListener('keyup', searchMethod, false);
    }


    return (

        <>
            <div className="container-fluid custom-animation-fadeInUp">

                <div className="position-relative">
                    <div className="position-absolute top-0 start-0">
                        {responseStatusGetAllPosts === "loading" &&
                            <div className="spinner-border spinner-border-sm text-light" style={{ marginLeft: 10 }} role="status" />
                        }
                    </div>
                </div>

                <div className="row">

                    <div className="col-xl-6" style={{ paddingBottom: 20 }}>

                        {posts && <Users />}

                        {(props.username === props.filter || props.filter === "active") &&



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
                                                    <img src={postImagePreview} className="img-fluid rounded mb-3" alt="post-img" style={{ maxHeight: 400, width: "100%", objectFit: "cover" }} />
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
                                        <small className="text-secondary">Max. 3 Posts</small>

                                    </div>
                                </div>
                            </div>

                        }

                        <div className="d-flex justify-content-center">
                            <div className="card container-fluid shadow" style={{ maxWidth: 500 }}>
                                <div className="card-body">

                                    <div className="alert alert-light" role="alert">
                                        <i className="bi bi-info-circle me-md-2"></i>
                                        <small>All posts are reviewed by the admin. <Link to="/privacy-policy" type="button" className="btn btn-link btn-sm">Privacy Policy</Link></small>
                                    </div>


                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="col-xl-6 me-mb-3">


                        <div className="d-flex justify-content-center">
                            <div className="card container-fluid shadow" style={{ maxWidth: 600, minHeight: 120 }}>
                                <div className="card-body">
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                        {(posts?.length !== 0 && responseStatusGetAllPosts !== "error") &&
                                            <input type="text" id="search-post-input" className="form-control search-post-input rounded-pill" onKeyUp={searchPosts} placeholder="Search..." autoComplete="off" />
                                        }

                                    </div>

                                    {responseStatusGetAllPosts === "error" && <Error />}
                                    {(posts?.length === 0 && responseStatusGetAllPosts === "success") && <Empty />}

                                </div>
                            </div>

                        </div>



                        {posts?.length !== 0 &&


                            <div id="scrollbar-small" className="d-flex justify-content-center" style={{ overflow: "scroll", maxHeight: "1000px", width: "auto", maxWidth: "auto", overflowX: "auto" }}>



                                <table id="table-posts" className="container-fluid">

                                    <tbody>

                                        {posts?.map(post =>



                                            <tr key={post.id}>
                                                <td>

                                                    <div className="card container-fluid animate__animated animate__fadeInUp shadow-sm" style={{ maxWidth: 500, marginTop: 50 }}>


                                                        {props.filter !== "active" &&

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

                                                        }


                                                        <div className="card-header bg-transparent">
                                                            <img src={post.user.userProfileImg ? `data:image/jpg;base64,${post.user.userProfileImg}` : default_user_profile_img} width="50" height="50" style={{ objectFit: "cover", cursor: 'pointer' }} alt="user-profile-img" className="position-absolute top-0 start-0 translate-middle rounded-circle border border-2 shadow me-md-2" onClick={() => navigate("/user/" + post.user.username)} />
                                                            <h6>{post.user.fullName}</h6>


                                                            {
                                                                props.userId === post.user.id &&
                                                                <div className="position-absolute top-0 end-0">
                                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                                        <button type="button" className="btn btn-light btn-sm" style={{ margin: 5 }} data-bs-toggle="modal" data-bs-target="#editPostModal" aria-label="Edit" data-balloon-pos="left" onClick={() => passPostDataUpdateNew(post.id, post.title, post.description, post.image)}><i className="bi bi-pencil-square"></i></button>
                                                                        <div className="dropdown" aria-label="Delete" data-balloon-pos="up">
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
                                                                <img src={`data:image/jpeg;base64,${post.image}`} className="img-fluid rounded" style={{ maxHeight: 400, width: "100%", objectFit: "cover" }} alt="post-img" />
                                                            }

                                                            <small style={{ fontSize: 12 }}>{post.description}</small>

                                                            <div className="position-absolute bottom-0 end-0 text-muted" style={{ padding: "5px", fontSize: 12 }}>

                                                                {post.updatedDate ?

                                                                    <small>updated: {moment(post.updatedDate).locale(moment_locale).format(moment_format_date_time_long)}</small>
                                                                    :
                                                                    <small>{moment(post.createdDate).locale(moment_locale).format(moment_format_date_time_long)}</small>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="card-footer bg-transparent text-muted">




                                                            <div className="btn-group dropup">
                                                                <button type="button" className="btn btn-light rounded-pill btn-sm me-md-2" onClick={() => postLike(post.id)}>

                                                                    <i className={"bi " + (post.isCurrentUserLikePost ? "bi-hand-thumbs-up-fill text-primary" : "bi-hand-thumbs-up") + " me-md-2"}></i>

                                                                    <small className={post.isCurrentUserLikePost ? "text-primary" : "text-secondary"}>Like</small>

                                                                </button>


                                                                {post.totalLikes !== 0 && <button type="button" className="btn btn-sm btn-light rounded-pill dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => getAllPostLikes(post.id)}><small>{post.totalLikes}</small></button>}


                                                                <ul className="dropdown-menu">

                                                                    {responseStatusGetAllPostsLikes === "loading" &&
                                                                        <div className="spinner-border spinner-border-sm text-secondary" style={{ marginLeft: 10 }} role="status" />
                                                                    }

                                                                    {responseStatusGetAllPostsLikes === "error" && <Error />}

                                                                    <div id="scrollbar-small" style={{ overflow: "scroll", maxHeight: 500, width: 300, maxWidth: "auto", overflowX: "auto" }}>
                                                                        {
                                                                            likes.map(like =>

                                                                                <ul className="list-group list-group-flush" key={like.likeId} style={{ minWidth: 250 }}>
                                                                                    <li className="list-group-item list-group-item-action" style={{ cursor: 'pointer' }} onClick={() => navigate("/user/" + like.username)}>
                                                                                        <img src={like.userProfileImg ? `data:image/jpg;base64,${like.userProfileImg}` : default_user_profile_img} width="30" height="30" style={{ objectFit: "cover" }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" />
                                                                                        <small className={(like.userId === props.userId ? "text-primary" : "text-dark")}>{like.userFullName.length >= 20 ? like.userFullName.substring(0, 25) + "..." : like.userFullName}</small>
                                                                                    </li>
                                                                                </ul>

                                                                            )
                                                                        }
                                                                    </div>
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

            {/* --- Modal (Edit Post) --- */}
            <div className="modal fade" id="editPostModal" tabIndex="-1" aria-labelledby="editPostModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editPostModalLabel">Edit Post</h1>
                            <button type="button" className="btn-close btn-close-dark" id='button-modal-update-post-close' data-bs-dismiss="modal" aria-label="Close"></button>
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
                                        <img src={`data:image/jpg;base64,${postImagePreviewNewTemporary}`} className="img-fluid rounded mb-3" alt="post-img" style={{ maxHeight: 400, width: "100%", objectFit: "cover" }} />
                                    </>
                                }

                                {postImageNew &&
                                    <>
                                        <button type="button" className="btn-close mb-3" aria-label="Close" onClick={(e) => setPostImageNew(null)}></button>
                                        <img src={postImagePreviewNew} className="img-fluid rounded mb-3" alt="post-img" style={{ maxHeight: 400, width: "100%", objectFit: "cover" }} />

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

export default Posts;