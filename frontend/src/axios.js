import axios from "axios";

window.axios = axios
axios.defaults.withCredentials = true
// axios.defaults.baseURL = "http://localhost:8000/api"
//let backendUrl = "https://" + window.location.hostname.toString() + "/api"
let backendUrl = "/api";
axios.defaults.baseURL = backendUrl
