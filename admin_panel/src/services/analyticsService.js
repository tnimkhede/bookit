import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const analyticsService = {
    getOverview: () => axios.get(`${API_URL}/analytics/overview`, getAuthHeaders()),

    getAppointmentsTrend: (days = 30) =>
        axios.get(`${API_URL}/analytics/appointments-trend?days=${days}`, getAuthHeaders()),

    getUserGrowth: (days = 30) =>
        axios.get(`${API_URL}/analytics/user-growth?days=${days}`, getAuthHeaders()),

    getProfessionalPerformance: () =>
        axios.get(`${API_URL}/analytics/professional-performance`, getAuthHeaders()),

    getCategoryDistribution: () =>
        axios.get(`${API_URL}/analytics/category-distribution`, getAuthHeaders()),
};
