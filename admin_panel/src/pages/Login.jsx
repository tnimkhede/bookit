import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <motion.div
                className="login-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="login-header">
                    <div className="logo-large">
                        <FiCalendar />
                    </div>
                    <h1>AppointHub Admin</h1>
                    <p>Sign in to manage your platform</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>
                            <FiMail />
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="admin@appointmentapp.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <FiLock />
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner-small"></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <FiLogIn />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Default credentials: admin@appointmentapp.com / password123</p>
                </div>
            </motion.div>
        </div>
    );
}
