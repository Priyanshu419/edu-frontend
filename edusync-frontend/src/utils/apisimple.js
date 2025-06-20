// utils/api.js
import axios from 'axios';

export const authService = {
  login: (data) => axios.post('https://localhost:5001/api/Auth/Login', data),
  register: (data) => axios.post('https://localhost:5001/api/Auth/Register', data)
};
