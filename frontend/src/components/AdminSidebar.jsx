import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/manage-doctors', label: 'Manage Doctors', icon: '🏥' },
    { path: '/manage-appointments', label: 'Appointments', icon: '📅' },
    { path: '/admin-bookmarks', label: 'Bookmarks', icon: '🔖' },
    { path: '/admin-profile', label: 'Profile', icon: '👤' },
    { path: '/admin-settings', label: 'Settings', icon: '⚙️' },
  ];

  const sidebarStyle = {
    width: collapsed ? '70px' : '220px',
    height: '100vh',
    backgroundColor: '#2c3e50',
    padding: '20px',
    boxSizing: 'border-box',
    transition: 'width 0.3s ease',
  };

  const itemStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px 0',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={sidebarStyle}>
      <div
        style={{ color: 'white', fontSize: '20px', marginBottom: '20px', cursor: 'pointer' }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? '→' : '←'}
      </div>

      {menuItems.map((item) => (
        <div
          key={item.path}
          style={itemStyle}
          onClick={() => handleNavigation(item.path)}
        >
          <span>{item.icon}</span>
          {!collapsed && <span style={{ marginLeft: '10px' }}>{item.label}</span>}
        </div>
      ))}

      <div
        style={itemStyle}
        onClick={() => handleNavigation('/logout')}
      >
        <span>🚪</span>
        {!collapsed && <span style={{ marginLeft: '10px' }}>Logout</span>}
      </div>
    </div>
  );
};

export default Sidebar;
