import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CoursesList = ({ courses, onCreateCourse }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">My Courses</h4>
        <Button variant="primary" onClick={onCreateCourse}>
          <i className="bi bi-plus-circle me-2"></i> New Course
        </Button>
      </div>
      
      {courses.length > 0 ? (
        <Row className="g-4">
          {courses.map(course => (
            <Col md={6} lg={4} key={course.id}>
              <Card className="h-100 border-0 shadow-sm hover-lift">
                <Card.Img 
                  variant="top" 
                  src={course.imageUrl || 'https://via.placeholder.com/300x150?text=Course+Image'} 
                  alt={course.title} 
                  height="180" 
                  style={{ objectFit: 'cover' }} 
                />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">
                      {course.category || 'General'}
                    </Badge>
                    <small className="text-muted">{course.level || 'All Levels'}</small>
                  </div>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    {course.description?.substring(0, 100)}...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i> {course.duration || 'N/A'}
                    </small>
                    <small className="text-muted">
                      <i className="bi bi-people me-1"></i> {course.enrollmentCount || 0} students
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/courses/${course.id}/manage`} className="w-100">
                      <Button variant="primary" className="w-100">
                        <i className="bi bi-pencil-square me-2"></i> Edit
                      </Button>
                    </Link>
                    <Link to={`/courses/${course.id}/assessments`} className="w-100">
                      <Button variant="outline-primary" className="w-100">
                        <i className="bi bi-clipboard-check me-2"></i> Assessments
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="border-0 bg-light">
          <Card.Body className="text-center py-5">
            <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="mt-3 mb-4">You haven't created any courses yet</p>
            <Button variant="primary" onClick={onCreateCourse}>
              <i className="bi bi-plus-circle me-2"></i> Create Your First Course
            </Button>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default CoursesList;
