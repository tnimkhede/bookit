import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiMail, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useTheme } from '../hooks/useTheme';
import './Settings.css';

export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@example.com',
    });
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        toast.success('Profile updated successfully!');
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (password.new !== password.confirm) {
            toast.error('Passwords do not match!');
            return;
        }
        toast.success('Password changed successfully!');
        setPassword({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="settings">
            <div className="settings-header">
                <h1>Settings</h1>
                <p className="settings-subtitle">Manage your account and preferences</p>
            </div>

            <div className="settings-grid">
                <motion.div
                    className="settings-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="card-header">
                        <h3><FiUser /> Profile Information</h3>
                    </div>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="Your name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            <FiSave /> Save Changes
                        </button>
                    </form>
                </motion.div>

                <motion.div
                    className="settings-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="card-header">
                        <h3><FiLock /> Change Password</h3>
                    </div>
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={password.current}
                                onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={password.new}
                                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={password.confirm}
                                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                placeholder="Confirm new password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            <FiLock /> Update Password
                        </button>
                    </form>
                </motion.div>

                <motion.div
                    className="settings-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="card-header">
                        <h3>Appearance</h3>
                    </div>
                    <div className="appearance-settings">
                        <div className="setting-item">
                            <div>
                                <h4>Theme</h4>
                                <p>Choose your preferred color scheme</p>
                            </div>
                            <button
                                className="theme-toggle-btn"
                                onClick={toggleTheme}
                            >
                                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="settings-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="card-header">
                        <h3>Notifications</h3>
                    </div>
                    <div className="notification-settings">
                        <div className="setting-item">
                            <div>
                                <h4>Email Notifications</h4>
                                <p>Receive email updates about platform activity</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div>
                                <h4>New User Alerts</h4>
                                <p>Get notified when new users register</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div>
                                <h4>Appointment Alerts</h4>
                                <p>Notifications for new appointments</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
