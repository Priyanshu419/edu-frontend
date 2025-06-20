import React from 'react';
import './FloatingElements.css';

const FloatingElements = () => {
  return (
    <div className="floating-elements">
      {/* Books */}
      <div className="floating-element book-1">
        <i className="bi bi-book text-white"></i>
      </div>
      <div className="floating-element book-2">
        <i className="bi bi-journal-text text-white"></i>
      </div>
      <div className="floating-element book-3">
        <i className="bi bi-journals text-white"></i>
      </div>
      
      {/* Tech elements */}
      <div className="floating-element code-1">
        <i className="bi bi-code-slash text-white"></i>
      </div>
      <div className="floating-element laptop">
        <i className="bi bi-laptop text-white"></i>
      </div>
      
      {/* Education elements */}
      <div className="floating-element certificate">
        <i className="bi bi-award text-white"></i>
      </div>
      <div className="floating-element graph">
        <i className="bi bi-graph-up text-white"></i>
      </div>
      
      {/* Collaboration elements */}
      <div className="floating-element people">
        <i className="bi bi-people text-white"></i>
      </div>
      <div className="floating-element chat">
        <i className="bi bi-chat-dots text-white"></i>
      </div>
      
      {/* Knowledge elements */}
      <div className="floating-element lightbulb">
        <i className="bi bi-lightbulb text-white"></i>
      </div>
    </div>
  );
};

export default FloatingElements;
