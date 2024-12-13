import axios from "axios";

let customAxios = axios.create({
  // Use this URL instead for local development
  //baseURL: "https://localhost:4000",
  baseURL: "https://api-musicmarkt.local",
  headers: {
    "Content-type": "application/json"
  }
})

/* customAxios.interceptors.response.use(response => {
  return response;
}, error => {
 if (error.response.status === 401) {
    router.push('/login')
 }
 return Promise.reject(error);
}); */

export default customAxios;