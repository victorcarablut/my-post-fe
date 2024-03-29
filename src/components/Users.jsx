import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../config.js";

import default_user_profile_img from '../assets/images/user.jpg';

function Users() {

    const navigate = useNavigate();

    // list
    const [users, setUsers] = useState([]);

    useEffect(() => {

        getAllUsers();

        // auto refresh - (start)
        const interval = setInterval(getAllUsers, 14000);

        return function () {

            // auto refresh - (stop)
            clearInterval(interval);
        };

    }, []);

    const getAllUsers = async () => {

        const jwt_token = secureLocalStorage.getItem("token");

        const config = {
            headers: {
                Authorization: "Bearer " + jwt_token
            }
        }

        await axios.get(`${url}/user/all`, config).then((res) => {

            if (res.status === 200) {

                setUsers(res.data);
            }

        }).catch(err => {
            return;
        })
    }

    const navigateToUserProfile = (username) => {
        document.getElementById('btn-close-offcanvasUsers').click();
        navigate("/user/" + username)
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
        <>



            <button className="btn btn-light rounded-pill position-relative shadow" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasUsers" aria-controls="offcanvasExample" onClick={getAllUsers}>
                <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-secondary">
                    {users?.length !== 0 && users?.length}
                </span>
                <i className="bi bi-people-fill me-md-2"></i><small className="me-md-2">Users</small><i className="bi bi-search"></i>

            </button>






            {/* --- Modal -> Offcanvas (All Users) --- */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasUsers" aria-labelledby="offcanvasUsersLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasUsersLabel">Users</h5>
                    <button type="button" className="btn-close" id="btn-close-offcanvasUsers" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div>

                        <div className="d-flex justify-content-center">

                            {users?.length !== 0 &&
                                <input type="text" id="search-user-input" className="form-control search-user-input rounded-pill mb-3" onKeyUp={searchUsers} placeholder="Search..." autoComplete="off" />
                            }

                        </div>

                        {users?.length !== 0 &&


                            <div id="scrollbar-small" className="d-flex justify-content-center" style={{ overflow: "scroll", maxHeight: "1000px", width: "auto", maxWidth: "auto", overflowX: "auto" }}>
                            

                                <table id="table-users" className="container-fluid" style={{paddingBottom: 30}}>

                            
                                    <tbody>

                                        {users?.map(user =>

                                            <tr key={user.userId}>
                                                <td>

                                                    <button className="btn btn-light rounded-pill animate__animated animate__fadeIn border border-secondary-subtle shadow-sm" style={{ marginTop: 6, marginBottom: 6, maxHeight: 50, marginRight: 10 }} onClick={() => navigateToUserProfile(user.username)}>
                                                        <img src={user.userProfileImg ? `data:image/jpg;base64,${user.userProfileImg}` : default_user_profile_img} width="30" height="30" style={{ objectFit: "cover" }} alt="user-profile-img" className="rounded-circle border border-2 me-md-2" />
                                                        <small>{user.fullName}</small> 
                                                    </button>

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

        </>
    )
}

export default Users;