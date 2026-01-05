import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../constants/Config';

const api = axios.create({
    baseURL: Config.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            // You might want to trigger a logout action here via a global event emitter or context
        }
        return Promise.reject(error);
    }
);

export default api;
