import { useNavigate } from 'react-router-dom';

const SidebarComponent = () => {
  const navigate = useNavigate();

  const sidebarStyle = {
    width: '220px',
    height: '100vh',
    backgroundColor: '#2c3e50',
    padding: '20px',
    boxSizing: 'border-box',
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
      <div style={itemStyle} onClick={() => handleNavigation('/profile')}>Profile</div>
      <div style={itemStyle} onClick={() => handleNavigation('/appointments')}>Manage Appointments</div>
      <div style={itemStyle} onClick={() => handleNavigation('/settings')}>Settings</div>
      <div style={itemStyle} onClick={() => handleNavigation('/bookmarks')}>Bookmarks</div>
      <div style={itemStyle} onClick={() => handleNavigation('/logout')}>Logout</div>
    </div>
  );
};

export default SidebarComponent;
