import axios from "axios";

const baseAxios = axios.create({
  baseURL: "http://localhost:5002",
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseAxios;