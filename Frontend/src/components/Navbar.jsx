import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#282c34',
      color: 'white'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '24px' }}>
        ShopEase
      </div>
      <div>
        <NavLink 
          to="/login" 
          style={({ isActive }) => ({
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: isActive ? '#21a0f0' : '#61dafb',
            borderRadius: '4px',
            textDecoration: 'none',
            color: 'black',
            fontWeight: 'bold'
          })}
        >
          Login
        </NavLink>
        <NavLink 
          to="/register" 
          style={({ isActive }) => ({
            padding: '8px 16px',
            backgroundColor: isActive ? '#1a82d6' : '#21a0f0',
            borderRadius: '4px',
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold'
          })}
        >
          Register
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;

