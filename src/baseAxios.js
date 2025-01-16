import axios from "axios";

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5002",  // .env에서 불러오기
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseAxios;