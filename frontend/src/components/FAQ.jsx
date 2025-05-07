// FAQ.jsx
import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How do I book an appointment?",
      answer: "You can book an appointment by logging into your user account, navigating to the 'Book Appointment' section, selecting your preferred doctor and available time slot, and confirming your booking."
    },
    {
      question: "Can I reschedule or cancel my appointment?",
      answer: "Yes, you can reschedule or cancel your appointment by logging into your account, going to 'My Appointments', and selecting the reschedule or cancel option. Please note that cancellations should be made at least 24 hours before the scheduled appointment."
    },
    {
      question: "How do I register as a new patient?",
      answer: "To register as a new patient, click on 'Login as User' on the homepage, then select 'Sign up as User'. Fill in your personal details, create a username and password, and submit the form."
    },
    {
      question: "How can I communicate with my doctor?",
      answer: "After logging in, you can send messages to your doctor through the 'Send Message' feature in your user dashboard. Administrators will ensure your message reaches the appropriate healthcare professional."
    },
    {
      question: "How do I view my appointment history?",
      answer: "Your appointment history is available in your user profile under 'My Appointments'. Here you can view all past, current, and upcoming appointments."
    },
    {
      question: "What should I do if I forgot my password?",
      answer: "On the login page, click on 'Forgot Password', enter your registered email, and follow the instructions sent to your email to reset your password."
    },
    {
      question: "How can I update my personal information?",
      answer: "You can update your personal information by logging into your account, navigating to 'My Profile', clicking on 'Edit Profile', making the necessary changes, and saving the updates."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container" id="faq">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <div 
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              {faq.question}
              <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
            </div>
            <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;