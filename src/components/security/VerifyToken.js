
// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

// Axios (API)
import axios from "axios";

// config file (URL)
import { url } from "../../config.js";

//import { AuthContext } from "./AuthContext.js";

export const VerifyToken = async () => {

  console.log("VerifyToken.js");

  let isValid = false;

  console.log(secureLocalStorage.getItem("token"));

  const jwt_token = secureLocalStorage.getItem("token");

  //console.log(jwt_token);

  const config = {
    headers: {
      Authorization: "Bearer " + jwt_token
    }

  }

  await axios.get(`${url}/token/verify`, config).then((res) => {
    if (res.status === 200) {
      console.log("token OK");
      isValid = true;
      //return true;
    } else {
      isValid = false;
      // return false;
    }

  }).catch(err => {
    //console.log(err);
    isValid = false
    //return false;
  })

  return isValid;
}

/* export const IsAuthenticatedContext = () => {
  return useContext(AuthContext)
}

export const IsAuthenticatedLocalStorage = () => {
  return secureLocalStorage.getItem("authenticated");;
}
 */