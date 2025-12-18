// In frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Trim all input values to remove any accidental whitespace
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        passwordConfirm: passwordConfirm.trim()
      };
      
      console.log('Submitting registration data:', JSON.stringify(userData, null, 2));
      
      const apiUrl = 'http://localhost:5000/api/auth/register';
      console.log('Making request to:', apiUrl);
      
      const response = await axios.post(apiUrl, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Registration successful:', response.data);
      
      // Show success message and redirect to login
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const serverError = error.response.data;
        
        // Handle validation errors
        if (error.response.status === 400 && serverError.errors) {
          // Format validation errors into a user-friendly message
          const errorMessages = Object.values(serverError.errors)
            .map(err => `• ${err.message || err.msg || err}`)
            .join('\n');
          setError(`Please fix the following errors:\n${errorMessages}`);
        } 
        // Handle duplicate email error
        else if (error.response.status === 400 && serverError.code === 11000) {
          setError('This email is already registered. Please use a different email or log in.');
        }
        // Handle other server errors
        else {
          setError(serverError.message || 'Registration failed. Please check your input and try again.');
        }
      } 
      // Handle network errors
      else if (error.request) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } 
      // Handle other errors
      else {
        setError(`An unexpected error occurred: ${error.message || 'Please try again later.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '1.5rem'
        }}>Create an Account</h2>
        
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#d32f2f',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <label style={{
              fontSize: '0.9rem',
              color: '#555',
              fontWeight: '500'
            }}>Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              required 
            />
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <label style={{
              fontSize: '0.9rem',
              color: '#555',
              fontWeight: '500'
            }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              required 
            />
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <label style={{
              fontSize: '0.9rem',
              color: '#555',
              fontWeight: '500'
            }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              required 
            />
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <label style={{
              fontSize: '0.9rem',
              color: '#555',
              fontWeight: '500'
            }}>Confirm Password</label>
            <input 
              type="password" 
              value={passwordConfirm} 
              onChange={(e) => setPasswordConfirm(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#a0c4ff' : '#4a90e2',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              ':hover': {
                backgroundColor: isLoading ? '#a0c4ff' : '#357abd',
              },
              opacity: isLoading ? 0.8 : 1
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <p style={{
            textAlign: 'center',
            marginTop: '1rem',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Already have an account?{' '}
            <a 
              href="/login" 
              style={{
                color: '#4a90e2',
                textDecoration: 'none',
                fontWeight: '500',
                ':hover': {
                  textDecoration: 'underline',
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;