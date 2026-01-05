import { useState, useEffect } from 'react';
import { adminService } from '../services';
import { toast } from 'react-toastify';
import { FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import './Users.css';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            const response = await adminService.getUsers(filter === 'all' ? null : filter, search);
            // Backend returns { success: true, data: [...] }
            setUsers(response.data || response || []);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await adminService.deleteUser(id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error(error.response?.data?.error || 'Failed to delete user');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="users-page">
            <div className="page-header">
                <h1>User Management</h1>
                <div className="header-actions">
                    <form onSubmit={handleSearch} className="search-form">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                    <div className="filter-wrapper">
                        <FiFilter className="filter-icon" />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Roles</option>
                            <option value="client">Clients</option>
                            <option value="professional">Professionals</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading users...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-cell">No users found</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-name">{user.name}</div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge ${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{formatDate(user.created_at)}</td>
                                        <td>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(user.id)}
                                                title="Delete User"
                                            >
                                                <FiTrash2 />
                                            </button>
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
