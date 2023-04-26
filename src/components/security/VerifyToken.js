
// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../../config.js";

export const VerifyToken = async () => {

  let isValid = false;

  const jwt_token = secureLocalStorage.getItem("token");

  const config = {
    headers: {
      Authorization: "Bearer " + jwt_token,
      'Content-Type': 'application/x-www-form-urlencoded' 
    }
  }

  await axios.get(`${url}/token/verify`, config).then((res) => {
    if (res.status === 200) {
      isValid = true;
    }

  }).catch(err => {
    isValid = false;
    secureLocalStorage.removeItem("token");
    return;
  })

  return isValid;
}
