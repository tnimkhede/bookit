import { useContext } from 'react';
import { FiSun, FiMoon, FiBell, FiSearch, FiUser } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import './Header.css';

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header">
            <div className="header-search">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                />
            </div>

            <div className="header-actions">
                <button
                    className="header-btn theme-toggle"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <FiMoon /> : <FiSun />}
                </button>

                <button className="header-btn notifications" title="Notifications">
                    <FiBell />
                    <span className="notification-badge">3</span>
                </button>

                <div className="header-user">
                    <div className="user-avatar">
                        <FiUser />
                    </div>
                    <div className="user-info">
                        <span className="user-name">Admin</span>
                        <span className="user-role">Administrator</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
