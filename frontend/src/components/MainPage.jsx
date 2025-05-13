// MainPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import FAQ from './FAQ';
import modern from '../assets/modern.png';
import expertStaff from '../assets/expertstaff.png';
import medicalEquipment from '../assets/medicalequipment.png';
import preventive from '../assets/preventive.png';
import nutritionTips from '../assets/nutritiontips.png';
import manageStress from '../assets/managestress.png';
const MainPage = () => {
  const navigate = useNavigate();
  // State for image carousel
  const [currentImage, setCurrentImage] = useState(0);
  
  // Hospital images for carousel
  const images = [
    modern,
    expertStaff,
    medicalEquipment
  ];  

  // Features list
  const features = [
    {
      icon: 'fas fa-user-md',
      title: 'Expert Doctors',
      description: 'Access to highly qualified medical professionals across various specializations.'
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Online Appointment',
      description: 'Book, reschedule, or cancel appointments easily through our online system.'
    },
    {
      icon: 'fas fa-comment-medical',
      title: 'Direct Messaging',
      description: 'Communicate directly with healthcare providers and administrative staff.'
    },
    {
      icon: 'fas fa-file-medical-alt',
      title: 'Medical Records',
      description: 'Secure access to your medical history and treatment records.'
    },
    {
      icon: 'fas fa-bell',
      title: 'Appointment Reminders',
      description: 'Receive timely notifications about upcoming appointments.'
    },
    {
      icon: 'fas fa-heartbeat',
      title: 'Health Monitoring',
      description: 'Track your health metrics and receive professional guidance.'
    },
    {
      icon: 'fas fa-prescription',
      title: 'Prescription Management',
      description: 'View and manage your prescriptions online.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure Platform',
      description: 'Your health data is protected with industry-leading security measures.'
    }
  ];

const blogPosts = [
  {
    title: 'Understanding Preventive Healthcare',
    summary: 'Learn about the importance of regular check-ups and preventive measures for long-term health.',
    image: preventive,
    date: 'April 15, 2025'
  },
  {
    title: 'Nutrition Tips for a Healthy Lifestyle',
    summary: 'Discover dietary recommendations from our expert nutritionists to maintain optimal health.',
    image: nutritionTips,
    date: 'April 10, 2025'
  },
  {
    title: 'Managing Stress in Modern Life',
    summary: 'Effective strategies to manage stress and improve mental wellbeing in today\'s fast-paced world.',
    image: manageStress,
    date: 'April 5, 2025'
  }
];


  // Automatic image carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

   // Handle navigation
   const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };
  return (
    <div className="main-page">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="logo-container">
          <i className="fas fa-hospital"></i>
        </div>
        <h1>Welcome to the Hospital Management</h1>
      </section>

      {/* Image Carousel */}
<section className="carousel-section">
  <div className="carousel-container">
    {images.map((image, index) => (
      <div
        key={index}
        className={`carousel-slide ${index === currentImage ? 'active' : ''}`}
      >
        <img 
          src={image} 
          alt={`Slide ${index + 1}`} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain', 
            transition: 'opacity 0.5s ease', 
            opacity: index === currentImage ? 1 : 0 
          }} 
        />
      </div>
    ))}
    <div className="carousel-indicators">
      {images.map((_, index) => (
        <span 
          key={index} 
          className={`indicator ${index === currentImage ? 'active' : ''}`}
          onClick={() => setCurrentImage(index)}
        />
      ))}
    </div>
  </div>
</section>


      {/* Login Section */}
      <section className="login-section" id="login-section">
        <div className="login-container">
          <div className="login-box user-login">
            <div className="login-icon">
              <i className="fas fa-user"></i>
            </div>
            <h2>User Portal</h2>
            <div className="login-buttons">
              <button className="login-btn" onClick={() => handleNavigation('/userloginform')}>Login as User</button>
              <button className="signup-btn" onClick={() => handleNavigation('/user-signup')}>Sign up as User</button>
            </div>
          </div>

          <div className="login-box admin-login">
            <div className="login-icon">
              <i className="fas fa-user-shield"></i>
            </div>
            <h2>Admin Portal</h2>
            <div className="login-buttons">
              <button className="login-btn" onClick={() => handleNavigation('/adminloginform')}>Login as Admin</button>
              <button className="signup-btn" onClick={() => handleNavigation('/admin-signup')}>Sign up as Admin</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2 className="section-heading">Our Features</h2>
        <div className="features-container">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-section" id="blog">
  <h2 className="section-heading">Latest from Our Blog</h2>
  <div className="blog-container">
    {blogPosts.map((post, index) => (
      <div key={index} className="blog-card">
        <div className="blog-image">
          <img 
            src={post.image} 
            alt={post.title} 
            style={{ width: '100%', height: '200px', objectFit: 'contain' }} 
          />
        </div>
        <div className="blog-content">
          <h3>{post.title}</h3>
          <p className="blog-date">{post.date}</p>
          <p className="blog-summary">{post.summary}</p>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* FAQ Section */}
      <FAQ />

      {/* Footer section will be imported from Navbar and Footer components */}
    </div>
  );
};

export default MainPage;