import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiUsers, FiCalendar, FiBriefcase, FiPieChart } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import './Analytics.css';

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState(30);
    const [appointmentsTrend, setAppointmentsTrend] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);
    const [professionalPerformance, setProfessionalPerformance] = useState([]);
    const [categoryDistribution, setCategoryDistribution] = useState([]);

    const COLORS = ['#667eea', '#764ba2', '#f5576c', '#4facfe', '#00f2fe', '#fa709a', '#fee140'];

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [trendRes, growthRes, perfRes, catRes] = await Promise.all([
                analyticsService.getAppointmentsTrend(dateRange),
                analyticsService.getUserGrowth(dateRange),
                analyticsService.getProfessionalPerformance(),
                analyticsService.getCategoryDistribution()
            ]);

            setAppointmentsTrend(trendRes.data);
            setUserGrowth(growthRes.data);
            setProfessionalPerformance(perfRes.data.slice(0, 10));
            setCategoryDistribution(catRes.data);
        } catch (error) {
            toast.error('Failed to fetch analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="analytics">
            <div className="analytics-header">
                <div>
                    <h1>Analytics Dashboard</h1>
                    <p className="analytics-subtitle">Comprehensive insights into your platform performance</p>
                </div>
                <div className="date-range-selector">
                    <button
                        className={`range-btn ${dateRange === 7 ? 'active' : ''}`}
                        onClick={() => setDateRange(7)}
                    >
                        7 Days
                    </button>
                    <button
                        className={`range-btn ${dateRange === 30 ? 'active' : ''}`}
                        onClick={() => setDateRange(30)}
                    >
                        30 Days
                    </button>
                    <button
                        className={`range-btn ${dateRange === 90 ? 'active' : ''}`}
                        onClick={() => setDateRange(90)}
                    >
                        90 Days
                    </button>
                </div>
            </div>

            <div className="analytics-grid">
                <motion.div
                    className="analytics-card full-width"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="card-header">
                        <h3><FiTrendingUp /> Appointments Trend</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={appointmentsTrend}>
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
                            <Line type="monotone" dataKey="count" stroke="#667eea" strokeWidth={3} name="Total" />
                            <Line type="monotone" dataKey="completed" stroke="#00f2fe" strokeWidth={2} name="Completed" />
                            <Line type="monotone" dataKey="cancelled" stroke="#f5576c" strokeWidth={2} name="Cancelled" />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    className="analytics-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="card-header">
                        <h3><FiUsers /> User Growth</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userGrowth}>
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
                            <Bar dataKey="clients" fill="#667eea" name="Clients" />
                            <Bar dataKey="professionals" fill="#764ba2" name="Professionals" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    className="analytics-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="card-header">
                        <h3><FiPieChart /> Category Distribution</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ category, count }) => `${category}: ${count}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {categoryDistribution.map((entry, index) => (
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

                <motion.div
                    className="analytics-card full-width"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="card-header">
                        <h3><FiBriefcase /> Top Professional Performance</h3>
                    </div>
                    <div className="performance-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Rating</th>
                                    <th>Total</th>
                                    <th>Completed</th>
                                    <th>Completion Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {professionalPerformance.map((prof, index) => (
                                    <tr key={index}>
                                        <td>{prof.name}</td>
                                        <td><span className="badge badge-info">{prof.category}</span></td>
                                        <td>⭐ {prof.rating}</td>
                                        <td>{prof.total_appointments}</td>
                                        <td>{prof.completed_appointments}</td>
                                        <td>
                                            <span className={`badge ${prof.completion_rate >= 80 ? 'badge-success' : 'badge-warning'}`}>
                                                {prof.completion_rate}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
