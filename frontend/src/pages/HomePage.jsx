import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/rooms');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="home-page">
            <div className="container">
                <div className="hero-section">
                    <div className="hero-content">
                        <h1>🎲 Welcome to Liar's Dice</h1>
                        <p className="hero-subtitle">
                            The classic bluffing game where deception meets strategy
                        </p>

                        {isAuthenticated ? (
                            <div className="welcome-back">
                                <p>Welcome back, <strong>{user?.username}</strong>!</p>
                                <button onClick={handleGetStarted} className="btn btn-primary hero-btn">
                                    View Game Rooms
                                </button>
                            </div>
                        ) : (
                            <div className="get-started">
                                <button onClick={handleGetStarted} className="btn btn-primary hero-btn">
                                    Get Started
                                </button>
                                <p className="login-hint">
                                    New here? <span onClick={() => navigate('/register')} className="link">Create an account</span> or <span onClick={() => navigate('/login')} className="link">sign in</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="features-section">
                    <h2>How to Play</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Roll & Hide</h3>
                            <p>Each player starts with 5 dice. Roll them secretly and keep your results hidden from other players.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🗣️</div>
                            <h3>Make Bids</h3>
                            <p>Players take turns bidding on how many dice of a certain value they think are on the table in total.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🎭</div>
                            <h3>Bluff & Challenge</h3>
                            <p>You can either raise the bid or challenge the previous player. If you challenge and they were lying, they lose a die!</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🏆</div>
                            <h3>Last One Standing</h3>
                            <p>When you lose all your dice, you're out. The last player with dice remaining wins the game!</p>
                        </div>
                    </div>
                </div>

                <div className="game-features">
                    <h2>Game Features</h2>
                    <div className="features-list">
                        <div className="feature-item">
                            <span className="feature-bullet">✓</span>
                            Real-time multiplayer gameplay
                        </div>
                        <div className="feature-item">
                            <span className="feature-bullet">✓</span>
                            2-6 players per game
                        </div>
                        <div className="feature-item">
                            <span className="feature-bullet">✓</span>
                            Password-protected rooms
                        </div>
                        <div className="feature-item">
                            <span className="feature-bullet">✓</span>
                            Easy-to-use interface
                        </div>
                        <div className="feature-item">
                            <span className="feature-bullet">✓</span>
                            No downloads required
                        </div>
                        <div className="feature-item">
                            <span className="feature-bullet">✓</span>
                            Free to play
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;