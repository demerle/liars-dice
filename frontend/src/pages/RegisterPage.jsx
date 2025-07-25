import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="auth-page">
            <div className="container">
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;