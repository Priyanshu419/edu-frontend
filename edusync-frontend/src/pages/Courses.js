import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { courseService } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { isAuthenticated, isStudent } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAllCourses();
        setCourses(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message || 'Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollInCourse(courseId);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in the course. Please try again.');
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="my-5">
      <h1 className="mb-4">Available Courses</h1>
      
      {loading && <div className="text-center my-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>}
      
      {error && (
        <div className="alert alert-danger">
          {error}
          <button 
            className="btn btn-link float-end" 
            onClick={() => {
              setError('');
              const fetchCourses = async () => {
                try {
                  const response = await courseService.getAllCourses();
                  setCourses(response.data || []);
                  setLoading(false);
                } catch (error) {
                  console.error('Error fetching courses:', error);
                  setError(error.message || 'Failed to load courses. Please try again later.');
                  setLoading(false);
                }
              };
              fetchCourses();
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      <Row className="mb-4">
        <Col md={6} className="mx-auto">
          <InputGroup>
            <Form.Control
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <p>Loading courses...</p>
        </div>
      ) : error ? (
        <div className="text-center my-5">
          <p className="text-danger">{error}</p>
        </div>
      ) : (
        <Row>
          {filteredCourses.length === 0 ? (
            <Col>
              <p className="text-center">No courses found matching your search.</p>
            </Col>
          ) : (
            filteredCourses.map(course => (
              <Col md={4} key={course.id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={course.imageUrl || `https://via.placeholder.com/300x150?text=${encodeURIComponent(course.title)}`} 
                    alt={course.title}
                  />
                  <Card.Body>
                    <Card.Title>{course.title}</Card.Title>
                    <Card.Text>{course.description}</Card.Text>
                    <div className="text-muted mb-3">
                      <p className="mb-1">Instructor: {course.instructor}</p>
                      <p className="mb-0">Students: {course.enrollmentCount || 0}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <Link to={`/courses/${course.id}`}>
                        <Button variant="outline-primary">View Details</Button>
                      </Link>
                      
                      {isAuthenticated() && isStudent() && (
                        <Button 
                          variant="primary"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Enroll Now
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default Courses;
