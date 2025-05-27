// Updated SignupPage.jsx
import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="particle-container">
      {[...Array(5)].map((_, index) => (
        <div className="particle" key={index}></div>
      ))}

      <div className="login-container">
        <div className="background"></div>
        <div className="login-form">
          <h2 className="login-id">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />

            <button type="submit">SIGN UP</button>
          </form>
        </div>
        <div className="powered-text">Powered by Stack-Nova(P) Ltd.</div>
      </div>
    </div>
  );
};

export default SignupPage;
