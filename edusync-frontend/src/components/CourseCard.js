import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import '../styles/CourseCard.css';

const CourseCard = ({ course }) => {
  // Default duration if not provided
  const duration = '8 weeks';
  
  return (
    <Card className="course-card border-0 shadow-sm mb-4 h-100">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={course.mediaUrl || 'https://via.placeholder.com/300x150?text=Course+Image'} 
          alt={course.title} 
          className="course-image"
          style={{ height: '180px', objectFit: 'cover' }}
        />
        <Badge 
          bg="warning" 
          text="dark" 
          className="position-absolute top-0 start-0 m-2 px-3 py-2 rounded-pill"
        >
          {course.category || 'Development'}
        </Badge>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-center mb-3">
          <div className="me-auto">
            <i className="bi bi-clock me-2 text-muted"></i>
            <span className="text-muted">{duration}</span>
          </div>
          <div>
            <i className="bi bi-people me-2 text-muted"></i>
            <span className="text-muted">{course.enrollmentCount || 0} students</span>
          </div>
        </div>
        
        <Card.Title className="course-title mb-3">{course.title}</Card.Title>
        
        <Card.Text className="text-muted mb-4">
          {course.description?.substring(0, 120)}
          {course.description?.length > 120 ? '...' : ''}
        </Card.Text>
        
        <div className="mt-auto">
          <div className="instructor-info d-flex align-items-center mb-3">
            <div 
              className="instructor-avatar me-2 bg-primary text-white d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            >
              <i className="bi bi-person"></i>
            </div>
            <div>
              <p className="mb-0">Instructor</p>
              <h6 className="mb-0">ID: {course.instructorId || 'Unknown'}</h6>
            </div>
          </div>
          
          <Link 
            to={`/courses/${course.courseId}`} 
            className="btn btn-primary w-100 details-button"
          >
            <i className="bi bi-arrow-right me-2"></i> Details
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
