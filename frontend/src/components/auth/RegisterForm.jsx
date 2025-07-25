import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateUsername, validateEmail, validatePassword } from '../../utils/helpers';
import ErrorMessage from '../common/ErrorMessage';
import '../../styles/components/LoginForm.css';

const RegisterForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, loading, error, clearError } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!validatePassword(formData.password)) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
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

        const result = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password
        });

        if (result.success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Join Liar's Dice</h2>

                <ErrorMessage message={error} onClose={clearError} />

                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        disabled={loading}
                        required
                    />
                    {validationErrors.username && (
                        <span className="field-error">{validationErrors.username}</span>
                    )}
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        disabled={loading}
                        required
                    />
                    {validationErrors.email && (
                        <span className="field-error">{validationErrors.email}</span>
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
                        placeholder="Create a password"
                        disabled={loading}
                        required
                    />
                    {validationErrors.password && (
                        <span className="field-error">{validationErrors.password}</span>
                    )}
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        disabled={loading}
                        required
                    />
                    {validationErrors.confirmPassword && (
                        <span className="field-error">{validationErrors.confirmPassword}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>

                <p className="auth-link">
                    Already have an account?
                    <Link to="/login" state={{ from: location.state?.from }}>
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterForm;