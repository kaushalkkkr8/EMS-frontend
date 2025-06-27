// src/lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3030/', // 👈 You can change this when deploying
  withCredentials: true,                // optional: if using cookies/session
});

export default instance;
