import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f8f9fa',
            color: '#343a40',
            fontFamily: 'Arial, sans-serif',
        }}>
            <h1 style={{
                fontSize: '10rem',
                margin: '0',
            }}>404</h1>
            <p style={{
                fontSize: '1.5rem',
                margin: '1rem 0',
            }}>Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" style={{
                fontSize: '1.2rem',
                color: '#007bff',
                textDecoration: 'none',
                border: '1px solid #007bff',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                transition: 'background-color 0.3s, color 0.3s',
            }} onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#007bff';
                e.currentTarget.style.color = '#fff';
            }} onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#007bff';
            }}>Return to Home</Link>
        </div>
    );
}
