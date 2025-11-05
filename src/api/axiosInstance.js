// import axios from "axios";
// import { API_BASE_URL } from "../utils/constants";
// axios.defaults.baseURL = API_BASE_URL;

// const requestWrapper = async (options) => {
//   let headers;
//   if (options?.headers) {
//     headers = options.headers; //GETTING HEADER IF EXIST OTHER WISE MOUNT THE HEADER DEFAULT
//   } else {
//     headers = { "Content-Type": "application/json" };
//   }

//   const persistedToken = localStorage.getItem("token");
//   const token = JSON.parse(persistedToken); //ALWAYS TAKING TOKEN FROM LOCAL AND PLACING IN HEADER
//   Object.assign(headers, { Authorization: "Bearer" + token });
//   Object.assign(options, { headers });
//   return axios(options)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((error) => {
//       console.error("Error In request", error.response);
//       return error.response.data;
//     });
// };

// export default requestWrapper;



// import axios from "axios";
// import { API_BASE_URL } from "../utils/constants";

// axios.defaults.baseURL = API_BASE_URL;

// const requestWrapper = async (options) => {
//   try {
//     // console.log("🔹 Request started with options:", options);

//     // Initialize headers
//     let headers = options?.headers || { "Content-Type": "application/json" };

//     // Get token
//     const persistedToken = localStorage.getItem("token");
//     if (persistedToken) {
//       try {
//         const token = persistedToken
//         headers["Authorization"] = `Bearer ${token}`;
//       } catch (parseErr) {
//         console.error("❌ Token parsing failed:", parseErr);
//       }
//     } else {
//       console.warn("⚠️ No token found in localStorage");
//     }

//     const finalOptions = { ...options, headers };
//     // console.log("✅ Final Axios Options:", finalOptions);

//     // Make the actual request
//     const res = await axios(finalOptions);
//     // console.log("✅ Response received:",finalOptions?.url,finalOptions?.method,res.data);
//     return res.data;

//   } catch (error) {
//     console.error("❌ RequestWrapper failed:", error);

//     // Log deeper error details if available
//     if (error.response) {
//       console.error("Server responded with:", error.response.status, error.response.data);
//       return error.response.data;
//     } else if (error.request) {
//       console.error("No response received from server:", error.request);
//       return { message: "No response from server" };
//     } else {
//       console.error("Error setting up request:", error.message);
//       return { message: error.message };
//     }
//   }
// };

// export default requestWrapper;





import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

axios.defaults.baseURL = API_BASE_URL;

const requestWrapper = async (options) => {
  try {
    let headers = options?.headers || { "Content-Type": "application/json" };

    const persistedToken = localStorage.getItem("token");
    if (persistedToken) {
      headers["Authorization"] = `Bearer ${persistedToken}`;
    }

    const finalOptions = { ...options, headers };
    const res = await axios(finalOptions);

    return res.data; // ✅ Success → return
  } catch (error) {
    // Log details for debugging
    console.error("❌ RequestWrapper failed:", error);

    if (error.response) {
      console.error("Server responded with:", error.response.status, error.response.data);

      // ✅ Throw error so createAsyncThunk catches it
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
