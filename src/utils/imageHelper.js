// // src/utils/imageHelper.js
// export const getImageUrl = (relativeUrl) => {
//     if (!relativeUrl) return "";
  
//     // If it's already a full URL, return as is
//     if (relativeUrl.startsWith("http")) {
//       return relativeUrl;
//     }
  
//     const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
//     return `${baseUrl}${relativeUrl.startsWith("/") ? "" : "/"}${relativeUrl}`;
//   };
  

export const getImageUrl = (relativeUrl) => {
  if (!relativeUrl) return "";

  if (relativeUrl.startsWith("http")) {
    return relativeUrl;
  }

  let baseUrl = "http://localhost:3000/uploads/coverpages/"; // default fallback

  // Try to read environment variable safely
  if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE_URL) {
    baseUrl = process.env.REACT_APP_API_BASE_URL;
  }

  return `${baseUrl}${relativeUrl.startsWith("/") ? "" : "/"}${relativeUrl}`;
};
