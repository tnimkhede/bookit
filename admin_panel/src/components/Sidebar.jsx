import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiBriefcase, FiCalendar, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import './Sidebar.css';

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const menuItems = [
        { path: '/', icon: FiHome, label: 'Dashboard' },
        { path: '/users', icon: FiUsers, label: 'Users' },
        { path: '/professionals', icon: FiBriefcase, label: 'Professionals' },
        { path: '/appointments', icon: FiCalendar, label: 'Appointments' },
        { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
        { path: '/settings', icon: FiSettings, label: 'Settings' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">
                        <FiCalendar />
                    </div>
                    <div className="logo-text">
                        <h2>AppointHub</h2>
                        <span>Admin Panel</span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <FiLogOut />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
