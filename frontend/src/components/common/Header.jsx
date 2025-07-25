import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo" onClick={() => navigate('/')}>
                        <h1>🎲 Liar's Dice</h1>
                    </div>

                    <nav className="nav">
                        {isAuthenticated ? (
                            <>
                                <button
                                    className={`nav-link ${isActive('/')}`}
                                    onClick={() => navigate('/')}
                                >
                                    Home
                                </button>
                                <button
                                    className={`nav-link ${isActive('/rooms')}`}
                                    onClick={() => navigate('/rooms')}
                                >
                                    Rooms
                                </button>
                                <div className="user-menu">
                                    <span className="username">Welcome, {user?.username}</span>
                                    <button className="btn btn-secondary" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="auth-buttons">
                                <button
                                    className={`nav-link ${isActive('/login')}`}
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </button>
                                <button
                                    className={`nav-link ${isActive('/register')}`}
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </button>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;