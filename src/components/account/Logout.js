// Secure Data (Local Storage)
import secureLocalStorage from "react-secure-storage";

export const Logout = async () => {
  secureLocalStorage.removeItem("token");
  window.location.reload();
}

