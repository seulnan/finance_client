import axios from "axios";

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,  // .env에서 불러오기
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseAxios;