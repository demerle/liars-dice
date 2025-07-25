import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import AuthGuard from './components/auth/AuthGuard';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomsPage from './pages/RoomsPage';
import GamePage from './pages/GamePage';

function App() {
    return (
        <AuthProvider>
            <GameProvider>
                <Router>
                    <div className="app">
                        <Header />
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route
                                    path="/rooms"
                                    element={
                                        <AuthGuard>
                                            <RoomsPage />
                                        </AuthGuard>
                                    }
                                />
                                <Route
                                    path="/game/:gameId"
                                    element={
                                        <AuthGuard>
                                            <GamePage />
                                        </AuthGuard>
                                    }
                                />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </main>
                    </div>
                </Router>
            </GameProvider>
        </AuthProvider>
    );
}

export default App;