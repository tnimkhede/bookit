import api from './api';

export const appointmentService = {
    create: async (data: {
        professionalId: string;
        date: string;
        time: string;
        duration: number;
        purpose: string;
    }) => {
        const response = await api.post('/appointments', data);
        return response.data;
    },

    getAll: async (status?: string) => {
        const params = status ? { status } : {};
        const response = await api.get('/appointments', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },

    cancel: async (id: string) => {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await api.put(`/appointments/${id}`, { status });
        return response.data;
    },
};
