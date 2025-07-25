import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateUsername, validatePassword } from '../../utils/helpers';
import ErrorMessage from '../common/ErrorMessage';
import '../../styles/components/LoginForm.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading, error, clearError } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [validationErrors, setValidationErrors] = useState({});

    const from = location.state?.from?.pathname || '/rooms';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!validateUsername(formData.username)) {
            errors.username = 'Username must be between 3-50 characters';
        }

        if (!validatePassword(formData.password)) {
            errors.password = 'Password must be at least 6 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) {
            return;
        }

        const result = await login(formData);

        if (result.success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login to Liar's Dice</h2>

                <ErrorMessage message={error} onClose={clearError} />

                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        disabled={loading}
                        required
                    />
                    {validationErrors.username && (
                        <span className="field-error">{validationErrors.username}</span>
                    )}
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        disabled={loading}
                        required
                    />
                    {validationErrors.password && (
                        <span className="field-error">{validationErrors.password}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="auth-link">
                    Don't have an account?
                    <Link to="/register" state={{ from: location.state?.from }}>
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;