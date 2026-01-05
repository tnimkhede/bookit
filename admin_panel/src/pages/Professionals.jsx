import { useState, useEffect } from 'react';
import { adminService } from '../services';
import { toast } from 'react-toastify';
import { FiSearch, FiStar, FiMapPin, FiPlus } from 'react-icons/fi';
import CreateProfessionalModal from '../components/CreateProfessionalModal';
import './Users.css'; // Reuse table styles

export default function Professionals() {
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProfessionals();
    }, []);

    const fetchProfessionals = async () => {
        try {
            const response = await adminService.getProfessionals(null, search);
            // Backend returns { success: true, data: [...] }
            setProfessionals(response.data || response || []);
        } catch (error) {
            toast.error('Failed to fetch professionals');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProfessionals();
    };

    return (
        <div className="users-page">
            <div className="page-header">
                <h1>Professional Management</h1>
                <div className="header-actions">
                    <form onSubmit={handleSearch} className="search-form">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search professionals..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                    <button
                        className="btn-primary"
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <FiPlus /> Add Professional
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading professionals...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Rating</th>
                                <th>Appointments</th>
                                <th>Joined Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {professionals.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-cell">No professionals found</td>
                                </tr>
                            ) : (
                                professionals.map((prof) => (
                                    <tr key={prof.id}>
                                        <td>
                                            <div className="user-name">{prof.name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{prof.email}</div>
                                        </td>
                                        <td>{prof.mobile || 'N/A'}</td>
                                        <td>
                                            <span className="role-badge professional">{prof.category}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FiMapPin size={12} /> {prof.location}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', fontWeight: '600' }}>
                                                <FiStar fill="#eab308" /> {prof.rating || 'N/A'}
                                            </div>
                                        </td>
                                        <td>{prof.total_appointments}</td>
                                        <td>{new Date(prof.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <CreateProfessionalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchProfessionals}
            />
        </div>
    );
}
