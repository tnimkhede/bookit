import { useState, useEffect } from 'react';
import { adminService } from '../services';
import { analyticsService } from '../services/analyticsService';
import { toast } from 'react-toastify';
import { FiUsers, FiCalendar, FiCheckCircle, FiClock, FiTrendingUp, FiBriefcase } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import StatsCard from '../components/StatsCard';
import './Dashboard.css';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalClients: 0,
        totalProfessionals: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        bookedAppointments: 0,
        completedAppointments: 0,
    });
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#667eea', '#764ba2', '#f5576c', '#4facfe', '#00f2fe'];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, trendRes] = await Promise.all([
                adminService.getStats(),
                analyticsService.getAppointmentsTrend(7)
            ]);

            // Backend returns { success: true, data: {...} }
            setStats(statsRes.data || statsRes);
            setTrendData(trendRes || []);
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const statusData = [
        { name: 'Pending', value: stats.pendingAppointments },
        { name: 'Booked', value: stats.bookedAppointments },
        { name: 'Completed', value: stats.completedAppointments },
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Platform Overview</h1>
                    <p className="dashboard-subtitle">Welcome back, Admin. Here's what's happening today.</p>
                </div>
            </div>

            <div className="stats-grid">
                <StatsCard
                    icon={FiUsers}
                    title="Total Users"
                    value={stats.totalUsers}
                    subtitle={`${stats.totalClients} Clients • ${stats.totalProfessionals} Professionals`}
                    gradient="primary"
                />
                <StatsCard
                    icon={FiCalendar}
                    title="Total Appointments"
                    value={stats.totalAppointments}
                    gradient="success"
                />
                <StatsCard
                    icon={FiClock}
                    title="Pending"
                    value={stats.pendingAppointments}
                    gradient="warning"
                />
                <StatsCard
                    icon={FiCheckCircle}
                    title="Completed"
                    value={stats.completedAppointments}
                    gradient="success"
                />
            </div>

            <div className="charts-grid">
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="chart-header">
                        <h3>Appointments Trend (Last 7 Days)</h3>
                        <FiTrendingUp className="chart-icon" />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis
                                dataKey="date"
                                stroke="var(--text-tertiary)"
                                tick={{ fill: 'var(--text-tertiary)' }}
                            />
                            <YAxis
                                stroke="var(--text-tertiary)"
                                tick={{ fill: 'var(--text-tertiary)' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#667eea"
                                strokeWidth={3}
                                dot={{ fill: '#667eea', r: 5 }}
                                name="Total"
                            />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#00f2fe"
                                strokeWidth={2}
                                name="Completed"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="chart-header">
                        <h3>Appointment Status Distribution</h3>
                        <FiCalendar className="chart-icon" />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            <motion.div
                className="quick-actions-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => window.location.href = '/users'}>
                        <FiUsers /> Manage Users
                    </button>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/professionals'}>
                        <FiBriefcase /> Approve Professionals
                    </button>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/appointments'}>
                        <FiCalendar /> View Appointments
                    </button>
                    <button className="btn btn-secondary" onClick={() => window.location.href = '/analytics'}>
                        <FiTrendingUp /> View Analytics
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
