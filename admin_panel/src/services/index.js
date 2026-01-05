import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats/overview');
        return response.data; // Backend returns { success: true, data: {...} }
    },

    getUsers: async (role, search) => {
        const params = {};
        if (role) params.role = role;
        if (search) params.search = search;
        const response = await api.get('/admin/users', { params });
        return response.data; // Backend returns { success: true, data: [...] }
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    getProfessionals: async (category, search) => {
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;
        const response = await api.get('/admin/professionals', { params });
        return response.data; // Backend returns { success: true, data: [...] }
    },

    createProfessional: async (data) => {
        const response = await api.post('/admin/professionals', data);
        return response.data;
    },

    getAppointments: async (status, search) => {
        const params = {};
        if (status) params.status = status;
        if (search) params.search = search;
        const response = await api.get('/admin/appointments', { params });
        return response.data; // Backend returns { success: true, data: [...] }
    },

    updateAppointmentStatus: async (id, status) => {
        const response = await api.put(`/admin/appointments/${id}`, { status });
        return response.data;
    },

    deleteAppointment: async (id) => {
        const response = await api.delete(`/admin/appointments/${id}`);
        return response.data;
    },
};

export const professionalService = {
    getProfile: async (id) => {
        const response = await api.get(`/professionals/${id}`);
        return response.data;
    },

    updateProfile: async (id, data) => {
        const response = await api.put(`/professionals/${id}`, data);
        return response.data;
    },

    updateWorkingHours: async (id, workingHours) => {
        const response = await api.put(`/professionals/${id}/working-hours`, { workingHours });
        return response.data;
    },

    addBlockedDate: async (id, date) => {
        const response = await api.post(`/professionals/${id}/blocked-dates`, { date });
        return response.data;
    },

    removeBlockedDate: async (id, dateId) => {
        const response = await api.delete(`/professionals/${id}/blocked-dates/${dateId}`);
        return response.data;
    },
};

export const appointmentService = {
    getAppointments: async (status) => {
        const params = status ? { status } : {};
        const response = await api.get('/appointments', { params });
        return response.data;
    },

    getAppointmentById: async (id) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },

    updateAppointment: async (id, data) => {
        const response = await api.put(`/appointments/${id}`, data);
        return response.data;
    },

    cancelAppointment: async (id) => {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    },
};
