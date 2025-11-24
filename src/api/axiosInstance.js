
// import axios from "axios";
// import { API_BASE_URL } from "../utils/constants";

// axios.defaults.baseURL = API_BASE_URL;

// const requestWrapper = async (options) => {
//   try {
//     let headers = options?.headers || { "Content-Type": "application/json" };

//     const persistedToken = localStorage.getItem("token");
//     if (persistedToken) {
//       headers["Authorization"] = `Bearer ${persistedToken}`;
//     }

//     const finalOptions = { ...options, headers };
//     const res = await axios(finalOptions);

//     return res.data; // ✅ Success → return
//   } catch (error) {
//     // Log details for debugging
//     console.error("❌ RequestWrapper failed:", error);

//     if (error.response) {
//       console.error("Server responded with:", error.response.status, error.response.data);

//       // ✅ Throw error so createAsyncThunk catches it
//       throw {
//         status: error.response.status,
//         data: error.response.data,
//         message: error.response.data?.message || "Server error",
//       };
//     } else if (error.request) {
//       throw { message: "No response from server" };
//     } else {
//       throw { message: error.message };
//     }
//   }
// };

// export default requestWrapper;






import axios from "axios";
import store from "../redux/store"; 
import { logout } from "../redux/features/authSlice";
import { API_BASE_URL } from "../utils/constants";

axios.defaults.baseURL = API_BASE_URL;

// Add response interceptor to detect expired token (401)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      store.dispatch(logout());
      // Optional: redirect can be handled in your app or here with e.g. window.location = "/login";
    }

    return Promise.reject(error);
  }
);

const requestWrapper = async (options) => {
  try {
    let headers = options?.headers || { "Content-Type": "application/json" };

    const persistedToken = localStorage.getItem("token");
    if (persistedToken) {
      headers["Authorization"] = `Bearer ${persistedToken}`;
    }

    const finalOptions = { ...options, headers };
    const res = await axios(finalOptions);

    return res.data; // Return data on success
  } catch (error) {
    console.error("❌ RequestWrapper failed:", error);
    if (error.response) {
      console.error("Server responded with:", error.response.status, error.response.data);
      throw {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message || "Server error",
      };
    } else if (error.request) {
      throw { message: "No response from server" };
    } else {
      throw { message: error.message };
    }
  }
};

export default requestWrapper;
