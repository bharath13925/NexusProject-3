import React, { useState, useEffect } from 'react';
import '../styles/UsersList.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users');
      
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
    );
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valueA = sortBy === 'name' ? a.name : 
                  sortBy === 'email' ? a.email : 
                  sortBy === 'location' ? a.location : a.phoneNumber;
    
    const valueB = sortBy === 'name' ? b.name : 
                  sortBy === 'email' ? b.email : 
                  sortBy === 'location' ? b.location : b.phoneNumber;
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
  });

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setUsers(users.filter(user => user._id !== userId));
          alert('User deleted successfully');
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user');
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) return <div className="users-loading">Loading users...</div>;
  if (error) return <div className="users-error">{error}</div>;

  return (
    <div className="users-list-container">
      <h2>Manage Users</h2>
      
      <div className="users-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, email, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-controls">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="location">Location</option>
            <option value="phoneNumber">Phone Number</option>
          </select>
          
          <button 
            onClick={toggleSortOrder}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {sortedUsers.length > 0 ? (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.location}</td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-users">
          <p>No users found matching your criteria.</p>
        </div>
      )}
      
      <div className="users-summary">
        <p>Total: {sortedUsers.length} users</p>
      </div>
    </div>
  );
};

export default UsersList;