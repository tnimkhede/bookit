import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../contexts/AuthContext';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (name: string, email: string, mobile: string, password: string, role: UserRole) => {
        const response = await api.post('/auth/register', { name, email, mobile, password, role });
        if (response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        const userStr = await AsyncStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
};
