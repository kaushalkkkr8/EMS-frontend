// src/lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ems-backend-eta-eight.vercel.app/', // 👈 You can change this when deploying
  withCredentials: true,                // optional: if using cookies/session
});

export default instance;
