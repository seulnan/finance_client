import axios from "axios";

const baseAxios = axios.create({
  baseURL: "http://localhost:5002", // 기본 URL 설정
  headers: {
    "Content-Type": "application/json", // 공통 Content-Type
  },
});

export default baseAxios;