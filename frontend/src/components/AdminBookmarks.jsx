import React, { useState, useEffect } from 'react';
import SidebarComponent from '../components/AdminSidebar';
import '../styles/Bookmarks.css';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      hospital: 'City Heart Hospital',
      rating: 4.8,
      imageUrl: '/api/placeholder/100/100',
      saved: true
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialization: 'Dermatology',
      hospital: 'Skin Care Center',
      rating: 4.7,
      imageUrl: '/api/placeholder/100/100',
      saved: true
    },
    {
      id: 3,
      doctorName: 'Dr. Priya Patel',
      specialization: 'Pediatrics',
      hospital: 'Children\'s Medical Center',
      rating: 4.9,
      imageUrl: '/api/placeholder/100/100',
      saved: true
    },
    {
      id: 4,
      doctorName: 'Dr. James Wilson',
      specialization: 'Orthopedics',
      hospital: 'Joint & Spine Institute',
      rating: 4.6,
      imageUrl: '/api/placeholder/100/100',
      saved: true
    }
  ]);
  
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'Understanding Heart Health',
      source: 'Medical Journal',
      date: '2025-03-15',
      snippet: 'Learn about the latest research in cardiovascular health and prevention strategies.',
      saved: true
    },
    {
      id: 2,
      title: 'Nutrition for Optimal Health',
      source: 'Health & Wellness',
      date: '2025-04-02',
      snippet: 'Discover the best dietary practices for maintaining good health and preventing disease.',
      saved: true
    },
    {
      id: 3,
      title: 'Mental Health in the Digital Age',
      source: 'Psychology Today',
      date: '2025-03-28',
      snippet: 'Explore the impacts of technology on mental wellbeing and strategies for digital balance.',
      saved: true
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('doctors');
  
  const removeBookmark = (id, type) => {
    if (type === 'doctor') {
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    } else if (type === 'article') {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  return (
    <div className="bookmarks-container">
      <div className="sidebar-container">
        <SidebarComponent />
      </div>
      <div className="main-content">
        <h2>Your Bookmarks</h2>
        
        <div className="bookmark-tabs">
          <button 
            className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            Doctors
          </button>
          <button 
            className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
            onClick={() => setActiveTab('articles')}
          >
            Articles
          </button>
        </div>
        
        {activeTab === 'doctors' && (
          <div className="bookmarks-list">
            {bookmarks.length > 0 ? (
              bookmarks.map(doctor => (
                <div className="bookmark-card" key={doctor.id}>
                  <div className="bookmark-image">
                    <img src={doctor.imageUrl} alt={doctor.doctorName} />
                  </div>
                  <div className="bookmark-details">
                    <h3>{doctor.doctorName}</h3>
                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                    <p><strong>Hospital:</strong> {doctor.hospital}</p>
                    <div className="rating">
                      <span className="stars">{'★'.repeat(Math.floor(doctor.rating))}{'☆'.repeat(5 - Math.floor(doctor.rating))}</span>
                      <span className="rating-value">{doctor.rating}</span>
                    </div>
                  </div>
                  <div className="bookmark-actions">
                    <button className="book-btn">Book Appointment</button>
                    <button 
                      className="remove-btn"
                      onClick={() => removeBookmark(doctor.id, 'doctor')}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-bookmarks">You haven't bookmarked any doctors yet.</p>
            )}
          </div>
        )}
        
        {activeTab === 'articles' && (
          <div className="bookmarks-list
          ">
            {articles.length > 0 ? (
              articles.map(article => (
                <div className="article-card" key={article.id}>
                  <div className="article-details">
                    <h3>{article.title}</h3>
                    <div className="article-meta">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <p className="article-snippet">{article.snippet}</p>
                  </div>
                  <div className="article-actions">
                    <button className="read-btn">Read More</button>
                    <button 
                      className="remove-btn"
                      onClick={() => removeBookmark(article.id, 'article')}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-bookmarks">You haven't bookmarked any articles yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;