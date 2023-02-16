import { useEffect, useState } from "react";

// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url} from "../../config.js";

const VerifyToken = () => {

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    token();
    console.log("verify token");
  }, []);

  const token = async () => {

    console.log(secureLocalStorage.getItem("token"));

    const jwt_token = secureLocalStorage.getItem("token");

    console.log(jwt_token);

    const config = {
      headers: { 
        Authorization: "Bearer " + jwt_token
      }

    }

    await axios.get(`${url}/token/verify`, config).then((res) => {
      if (res.status === 200) {
        console.log("token OK");
        setIsValid(true);
      } else {
        return;
      }

    }).catch(err => {
      //console.log(err);
      setIsValid(false);
      return;
    })

  }

  return isValid;
}

export default VerifyToken;