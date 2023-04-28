
import { useEffect } from 'react';

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

import Posts from './Posts';

// config file (URL)
import { url } from "../config.js";

import { VerifyToken } from './security/VerifyToken.js';
import { Logout } from './account/Logout.js';
import { useState } from 'react';


function Home() {

  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {

    const checkAuth = async () => {
      const verifyToken = await VerifyToken();
      if (!verifyToken) {
        await Logout();
      } else {
        await getUserDetails();
      }
    }

    checkAuth();

  }, []);



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
        setUserEmail(res.data.email);
      }

    }).catch(err => {
      return;
    })

  }


  return (
    <div className="container-fluid">
      {userId &&
        <Posts filter="all" userId={userId} username={username} userEmail={userEmail} />
      }
    </div>
  )
}

export default Home;