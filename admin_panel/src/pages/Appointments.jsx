import { useState, useEffect } from 'react';
import { adminService } from '../services';
import { toast } from 'react-toastify';
import { FiSearch, FiFilter, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import './Users.css'; // Reuse table styles

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, [filter]);

    const fetchAppointments = async () => {
        try {
            const response = await adminService.getAppointments(filter === 'all' ? null : filter, search);
            // Backend returns { success: true, data: [...] }
            setAppointments(response.data || response || []);
        } catch (error) {
            toast.error('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAppointments();
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await adminService.updateAppointmentStatus(id, status);
            toast.success(`Appointment marked as ${status}`);
            fetchAppointments();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await adminService.deleteAppointment(id);
                toast.success('Appointment deleted');
                fetchAppointments();
            } catch (error) {
                toast.error('Failed to delete appointment');
            }
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            booked: { bg: '#dbeafe', color: '#1e40af' },
            completed: { bg: '#d1fae5', color: '#065f46' },
            cancelled: { bg: '#fee2e2', color: '#991b1b' },
            pending: { bg: '#fef3c7', color: '#92400e' },
        };
        const style = styles[status] || styles.pending;
        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                backgroundColor: style.bg,
                color: style.color
            }}>
                {status}
            </span>
        );
    };

    return (
        <div className="users-page">
            <div className="page-header">
                <h1>Appointment Management</h1>
                <div className="header-actions">
                    <form onSubmit={handleSearch} className="search-form">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search client or professional..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                    <div className="filter-wrapper">
                        <FiFilter className="filter-icon" />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="booked">Booked</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading appointments...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Client</th>
                                <th>Professional</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-cell">No appointments found</td>
                                </tr>
                            ) : (
                                appointments.map((apt) => (
                                    <tr key={apt.id}>
                                        <td>
                                            <div style={{ fontWeight: '500' }}>{new Date(apt.appointment_date).toLocaleDateString()}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.appointment_time} ({apt.duration} min)</div>
                                        </td>
                                        <td>
                                            <div className="user-name">{apt.client_name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.client_email}</div>
                                        </td>
                                        <td>
                                            <div className="user-name">{apt.professional_name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.professional_category}</div>
                                        </td>
                                        <td>{apt.purpose}</td>
                                        <td>{getStatusBadge(apt.status)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {apt.status === 'booked' && (
                                                    <button
                                                        className="action-btn"
                                                        style={{ color: '#059669' }}
                                                        onClick={() => handleStatusUpdate(apt.id, 'completed')}
                                                        title="Mark Completed"
                                                    >
                                                        <FiCheck />
                                                    </button>
                                                )}
                                                {apt.status !== 'cancelled' && (
                                                    <button
                                                        className="action-btn"
                                                        style={{ color: '#dc2626' }}
                                                        onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                                                        title="Cancel Appointment"
                                                    >
                                                        <FiX />
                                                    </button>
                                                )}
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDelete(apt.id)}
                                                    title="Delete Record"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
