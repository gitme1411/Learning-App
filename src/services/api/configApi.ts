import axios from 'axios';
import {store} from '../../store';

const apiInstances = axios.create({
  baseURL: 'https://mobileapplication.info/api',
  // baseURL: 'https://jamesedutech.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstances.interceptors.request.use(
  config => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default apiInstances;
