import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiLock, FiBriefcase, FiMapPin, FiInfo, FiClock } from 'react-icons/fi';
import { adminService } from '../services';
import { toast } from 'react-toastify';
import './CreateProfessionalModal.css';

export default function CreateProfessionalModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        category: '',
        location: '',
        about: '',
        appointmentDuration: 30
    });

    const categories = [
        'Doctor',
        'Lawyer',
        'Consultant',
        'Tutor',
        'Salon',
        'Fitness Trainer',
        'Lawns',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await adminService.createProfessional(formData);
            toast.success('Professional created successfully');
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                name: '',
                email: '',
                mobile: '',
                password: '',
                category: '',
                location: '',
                about: '',
                appointmentDuration: 30
            });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create professional');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div
                    className="modal-content"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                >
                    <div className="modal-header">
                        <h2>Add New Professional</h2>
                        <button className="close-btn" onClick={onClose}>
                            <FiX />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="create-prof-form">
                        <div className="form-section">
                            <h3>Account Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label><FiUser /> Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Dr. Sarah Smith"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label><FiMail /> Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="sarah@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label><FiUser /> Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="+1234567890"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label><FiLock /> Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Set temporary password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Professional Details</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label><FiBriefcase /> Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><FiMapPin /> Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. New York, NY"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label><FiClock /> Appointment Duration (minutes)</label>
                                <select
                                    name="appointmentDuration"
                                    value={formData.appointmentDuration}
                                    onChange={handleChange}
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label><FiInfo /> About</label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    placeholder="Brief description..."
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Professional'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
