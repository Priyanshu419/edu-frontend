import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { courseService, userService } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import HeroImageOrange from '../assets/images/hero-image-orange';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courseCount: 0,
    instructorCount: 0,
    studentCount: 0
  });
  const { isAuthenticated, isStudent, isInstructor } = useAuth();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Use the getAllCourses API endpoint to fetch all courses
      const response = await courseService.getAllCourses();
      
      // Take the first 3 courses as featured courses
      // In a real implementation, you might have a specific endpoint for featured courses
      // or a property on the course to indicate if it's featured
      const featured = response.data.slice(0, 3);
      setFeaturedCourses(featured);
      
      // Update course count in stats
      setStats(prevStats => ({
        ...prevStats,
        courseCount: response.data.length
      }));
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to empty array if API fails
      setFeaturedCourses([]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStats = async () => {
    try {
      const response = await userService.getStats();
      if (response.data) {
        setStats({
          courseCount: response.data.courseCount || 0,
          instructorCount: response.data.instructorCount || 0,
          studentCount: response.data.studentCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default values if API fails
    }
  };

  // Fetch courses and stats when component mounts
  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  return (
    <>
      {/* Hero Section with Diagonal Split Design - Welcome Banner */}
      <div className="hero-diagonal text-white py-5 mb-5 position-relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="position-absolute" style={{ top: '10%', left: '5%', zIndex: 1 }}>
          <i className="bi bi-hexagon-fill text-white opacity-10" style={{ fontSize: '4rem' }}></i>
        </div>
        <div className="position-absolute" style={{ bottom: '10%', right: '5%', zIndex: 1 }}>
          <i className="bi bi-circle-fill text-white opacity-10" style={{ fontSize: '3rem' }}></i>
        </div>
        
        <Container className="position-relative py-5" style={{ zIndex: 2 }}>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <Badge bg="accent" className="mb-3 py-2 px-3">NEW LEARNING EXPERIENCE</Badge>
              <h1 className="display-4 fw-bold mb-4">Unlock Your <span className="border-accent-bottom">Potential</span> with EduSync</h1>
              <p className="lead mb-4 border-accent-left">
                A modern learning platform that combines cutting-edge technology with expert-designed curriculum for a personalized education experience.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/courses">
                  <Button variant="light" size="lg" className="rounded-pill shadow-sm">
                    <i className="bi bi-collection me-2"></i>Explore Courses
                  </Button>
                </Link>
                {!isAuthenticated() ? (
                  <Link to="/register">
                    <Button variant="accent" size="lg" className="rounded-pill shadow-sm">
                      <i className="bi bi-person-plus me-2"></i>Join Now
                    </Button>
                  </Link>
                ) : isStudent() ? (
                  <Button 
                    variant="accent" 
                    size="lg" 
                    className="rounded-pill shadow-sm"
                    onClick={() => navigate('/student-dashboard')}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>My Dashboard
                  </Button>
                ) : isInstructor() && (
                  <Button 
                    variant="accent" 
                    size="lg" 
                    className="rounded-pill shadow-sm"
                    onClick={() => navigate('/instructor-dashboard')}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>My Dashboard
                  </Button>
                )}
              </div>
              
              {/* Stats Section */}
              <Row className="mt-5 text-center">
                <Col xs={4}>
                  <div className="p-3 bg-white bg-opacity-10 rounded-3">
                    <h3 className="mb-0">{stats.courseCount > 0 ? `${stats.courseCount}+` : 'New'}</h3>
                    <small>Courses</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="p-3 bg-white bg-opacity-10 rounded-3">
                    <h3 className="mb-0">{stats.instructorCount > 0 ? `${stats.instructorCount}+` : 'New'}</h3>
                    <small>Instructors</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="p-3 bg-white bg-opacity-10 rounded-3">
                    <h3 className="mb-0">{stats.studentCount > 0 ? `${stats.studentCount}+` : 'New'}</h3>
                    <small>Students</small>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <div className="position-relative float-animation">
                <div className="img-fluid rounded-4 shadow-lg overflow-hidden">
                  <HeroImageOrange />
                </div>
                
                {/* Feature Highlights */}
                <div className="position-absolute bg-white text-primary p-3 rounded-3 shadow-sm" 
                     style={{ top: '10%', right: '-5%', zIndex: 3, maxWidth: '200px' }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-mortarboard-fill me-2 fs-4"></i>
                    <div>
                      <h6 className="mb-0">Expert Instructors</h6>
                      <small className="text-secondary">Learn from the best</small>
                    </div>
                  </div>
                </div>
                
                <div className="position-absolute bg-white text-primary p-3 rounded-3 shadow-sm" 
                     style={{ bottom: '10%', left: '-5%', zIndex: 3, maxWidth: '200px' }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-laptop me-2 fs-4"></i>
                    <div>
                      <h6 className="mb-0">Interactive Learning</h6>
                      <small className="text-secondary">Engage and excel</small>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Courses with Orange Theme */}
      <div className="bg-light-orange py-5 mb-5">
        <Container>
          <div className="text-center mb-5">
            <Badge bg="accent" className="mb-2">TOP RATED</Badge>
            <h2 className="display-5 fw-bold">Featured <span className="border-accent-bottom">Courses</span></h2>
            <p className="lead text-muted w-75 mx-auto">Discover our most popular and highly-rated courses designed to help you master new skills quickly.</p>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading courses...</p>
            </div>
          ) : (
            <Row>
              {featuredCourses.map(course => (
                <Col key={course.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100 border-0 rounded-4 overflow-hidden">
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={course.imageUrl || `https://via.placeholder.com/300x150?text=${encodeURIComponent(course.title)}`}
                        style={{height: '180px', objectFit: 'cover'}} 
                      />
                      <div className="position-absolute top-0 start-0 p-3">
                        <Badge bg="primary" pill className="px-3 py-2">
                          {course.category || 'Course'}
                        </Badge>
                      </div>
                    </div>
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i> {course.duration || '8 weeks'}
                        </small>
                        <small className="text-muted">
                          <i className="bi bi-people me-1"></i> {course.students || '24'} students
                        </small>
                      </div>
                      <Card.Title className="fs-4">{course.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {course.description.length > 100 
                          ? `${course.description.substring(0, 100)}...` 
                          : course.description
                        }
                      </Card.Text>
                      
                      <div className="d-flex align-items-center mt-3">
                        <div className="me-auto">
                          <small className="text-muted d-block">Instructor</small>
                          <span className="fw-bold">{course.instructor}</span>
                        </div>
                        <Link to={`/courses/${course.id}`}>
                          <Button variant="primary" className="rounded-pill px-4">
                            <i className="bi bi-arrow-right"></i> Details
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          
          <div className="text-center mt-4">
            <Link to="/courses">
              <Button variant="outline-primary" size="lg" className="rounded-pill px-5">
                View All Courses
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      {/* Featured Courses Section - Available Courses */}
      <div className="bg-light py-5 mb-5">
        <Container>
          <Row className="mb-4">
            <Col lg={8} className="mx-auto text-center">
              <Badge bg="accent" className="mb-2">FEATURED COURSES</Badge>
              <h2 className="display-5 fw-bold mb-3">Explore Our <span className="border-accent-bottom">Top Courses</span></h2>
              <p className="lead text-muted">Discover our most popular courses designed to help you advance your career and expand your knowledge.</p>
            </Col>
          </Row>

          <Row className="g-4 py-4">
            <Col md={4}>
              <div className="p-4 h-100 bg-white rounded-4 shadow-sm hover-lift">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                  <i className="bi bi-laptop text-primary fs-3"></i>
                </div>
                <h4>Learn Anywhere</h4>
                <p className="text-muted">Access your courses from any device at any time. Our platform is fully responsive and designed for learning on the go.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-4 h-100 bg-white rounded-4 shadow-sm hover-lift">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                  <i className="bi bi-people text-primary fs-3"></i>
                </div>
                <h4>Expert Instructors</h4>
                <p className="text-muted">Learn from industry experts who are passionate about teaching and committed to your success.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-4 h-100 bg-white rounded-4 shadow-sm hover-lift">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                  <i className="bi bi-graph-up text-primary fs-3"></i>
                </div>
                <h4>Track Progress</h4>
                <p className="text-muted">Monitor your learning journey with detailed analytics and progress tracking to stay motivated.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5">
        <Row className="mb-4">
          <Col lg={8} className="mx-auto text-center">
            <Badge bg="accent" className="mb-2">WHY CHOOSE US</Badge>
            <h2 className="display-5 fw-bold mb-3">Learning Made <span className="border-accent-bottom">Simple</span></h2>
            <p className="lead text-muted">Our platform combines technology and expert instruction to provide an exceptional learning experience.</p>
          </Col>
        </Row>

        <Row className="g-4 py-4">
          <Col md={4}>
            <div className="p-4 h-100 bg-white rounded-4 shadow-sm hover-lift">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <i className="bi bi-laptop text-primary fs-3"></i>
              </div>
              <h4>Learn Anywhere</h4>
              <p className="text-muted">Access your courses from any device at any time. Our platform is fully responsive and designed for learning on the go.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-4 h-100 bg-white rounded-4 shadow-sm hover-lift">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <i className="bi bi-people text-primary fs-3"></i>
              </div>
              <h4>Expert Instructors</h4>
              <p className="text-muted">Learn from industry experts who are passionate about teaching and committed to your success.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-4 h-100 bg-white rounded-4 shadow-sm hover-lift">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <i className="bi bi-graph-up text-primary fs-3"></i>
              </div>
              <h4>Track Progress</h4>
              <p className="text-muted">Monitor your learning journey with detailed analytics and progress tracking to stay motivated.</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="bg-accent text-white py-5 mb-5">
        <Container className="py-4">
          <Row className="align-items-center">
            <Col lg={8} className="mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold mb-3">Ready to Start Learning?</h2>
              <p className="lead mb-0">Join thousands of students already learning on our platform.</p>
            </Col>
            <Col lg={4} className="text-lg-end">
              {!isAuthenticated() ? (
                <Link to="/register">
                  <Button variant="light" size="lg" className="rounded-pill px-5">
                    <i className="bi bi-arrow-right-circle me-2"></i>Get Started
                  </Button>
                </Link>
              ) : (
                <Link to={isStudent() ? "/student-dashboard" : "/instructor-dashboard"}>
                  <Button variant="light" size="lg" className="rounded-pill px-5">
                    <i className="bi bi-speedometer2 me-2"></i>Go to Dashboard
                  </Button>
                </Link>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Home;
