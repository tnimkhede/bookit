import api from './api';

export const professionalService = {
    getAll: async (params?: { category?: string; location?: string; search?: string }) => {
        const response = await api.get('/professionals', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/professionals/${id}`);
        return response.data;
    },

    getAvailability: async (id: string, date: string) => {
        const response = await api.get(`/professionals/${id}/availability`, {
            params: { date },
        });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/professionals/me');
        return response.data;
    },
};
