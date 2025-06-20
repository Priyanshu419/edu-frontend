import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, assessmentService } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch course details
      console.log('Fetching course with ID:', courseId);
      const courseResponse = await courseService.getCourseById(courseId);
      console.log('Course data received:', courseResponse.data);
      
      // Check if mediaUrl exists and is valid
      if (courseResponse.data.mediaUrl) {
        console.log('Media URL found:', courseResponse.data.mediaUrl);
        // Make sure the URL is properly formatted for access
        const mediaUrl = courseResponse.data.mediaUrl;
        courseResponse.data.formattedMediaUrl = mediaUrl;
        
        // Determine media type for proper rendering
        const fileExtension = mediaUrl.split('.').pop().toLowerCase();
        courseResponse.data.mediaType = getMediaType(fileExtension);
      } else {
        console.log('No media URL found for this course');
      }
      
      setCourse(courseResponse.data);
      
      // Fetch assessments for this course
      console.log('Fetching assessments for course:', courseId);
      const assessmentsResponse = await assessmentService.getAssessments();
      console.log('All assessments:', assessmentsResponse.data);
      // Filter assessments for this course
      const courseAssessments = assessmentsResponse.data.filter(
        assessment => assessment.courseId === courseId
      );
      console.log('Filtered assessments for this course:', courseAssessments);
      setAssessments(courseAssessments);
    } catch (error) {
      console.error('Error fetching course details:', error);
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setError('Failed to load course details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to determine media type based on file extension
  const getMediaType = (extension) => {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    const audioTypes = ['mp3', 'wav', 'ogg', 'aac'];
    const documentTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];
    
    if (imageTypes.includes(extension)) return 'image';
    if (videoTypes.includes(extension)) return 'video';
    if (audioTypes.includes(extension)) return 'audio';
    if (documentTypes.includes(extension)) return 'document';
    return 'other';
  };

  // Fetch course details when component mounts
  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleEnroll = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      await courseService.enrollInCourse(courseId);
      // Use a more user-friendly notification instead of alert
      setError('');
      // Show success message
      setActiveTab('overview');
      // Refresh course data to update enrollment status
      fetchCourseDetails();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setError('Failed to enroll in the course. Please try again.');
    }
  };

  const handleStartAssessment = (assessmentId) => {
    navigate(`/assessments/${assessmentId}`);
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <p>Loading course details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={8}>
          <h1>{course.title}</h1>
          <p className="lead">{course.description}</p>
          <div className="mb-4">
            <span className="text-muted me-3">Instructor ID: {course.instructorId}</span>
            <span className="text-muted">Students Enrolled: {course.enrollmentCount || 0}</span>
          </div>
          
          {course.mediaUrl ? (
            <div className="mt-4 mb-4">
              {course.mediaUrl.toLowerCase().endsWith('.mp4') || 
               course.mediaUrl.toLowerCase().endsWith('.webm') || 
               course.mediaUrl.toLowerCase().endsWith('.ogg') ? (
                <div>
                  <h4>Course Video</h4>
                  <video controls className="img-fluid rounded w-100" onError={(e) => {
                    console.error('Video failed to load:', e);
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML += '<div class="alert alert-warning">Video could not be loaded</div>';
                  }}>
                    <source src={course.mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : course.mediaUrl.toLowerCase().endsWith('.mp3') || 
                 course.mediaUrl.toLowerCase().endsWith('.wav') || 
                 course.mediaUrl.toLowerCase().endsWith('.ogg') ? (
                <div>
                  <h4>Course Audio</h4>
                  <audio controls className="w-100" onError={(e) => {
                    console.error('Audio failed to load:', e);
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML += '<div class="alert alert-warning">Audio could not be loaded</div>';
                  }}>
                    <source src={course.mediaUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : course.mediaUrl.toLowerCase().endsWith('.pdf') ? (
                <div>
                  <h4>Course Material</h4>
                  <a href={course.mediaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                    <i className="bi bi-file-earmark-pdf me-2"></i>View PDF
                  </a>
                </div>
              ) : course.mediaUrl.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) ? (
                <div>
                  <h4>Course Image</h4>
                  <img 
                    src={course.mediaUrl} 
                    alt="Course media" 
                    className="img-fluid rounded" 
                    onError={(e) => {
                      console.error('Image failed to load:', course.mediaUrl);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x450?text=Course+Image+Not+Available';
                    }}
                  />
                </div>
              ) : (
                <div>
                  <h4>Course Resource</h4>
                  <a href={course.mediaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                    <i className="bi bi-download me-2"></i>Download Media
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 mb-4">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                No media available for this course yet.
              </div>
              <img 
                src="https://via.placeholder.com/800x450?text=No+Course+Media+Available" 
                alt="No media available" 
                className="img-fluid rounded" 
              />
            </div>
          )}
        </Col>
        <Col md={4} className="d-flex justify-content-end align-items-start">
          {isAuthenticated() && isStudent() && (
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleEnroll}
            >
              Enroll Now
            </Button>
          )}
        </Col>
      </Row>

      <Card className="mt-4 mb-5">
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="overview" onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="overview">Overview</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="content">Course Content</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="assessments">Assessments</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane active={activeTab === 'overview'}>
              <h4>About this Course</h4>
              <p>{course.content || 'No overview information available for this course.'}</p>
              
              <h4 className="mt-4">What You'll Learn</h4>
              <ul>
                <li>Understand core concepts and principles</li>
                <li>Apply knowledge through practical exercises</li>
                <li>Build real-world projects to demonstrate your skills</li>
                <li>Prepare for industry certification exams</li>
              </ul>
            </Tab.Pane>
            
            <Tab.Pane active={activeTab === 'content'}>
              <h4>Course Media</h4>
              {course.mediaUrl ? (
                <div className="mt-3">
                  <Card className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Course Media</h5>
                        </div>
                      </div>
                      
                      {/* Render different media types appropriately */}
                      {course.mediaType === 'image' && (
                        <div className="text-center">
                          <img 
                            src={course.mediaUrl} 
                            alt="Course media" 
                            className="img-fluid rounded" 
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                          />
                        </div>
                      )}
                      
                      {course.mediaType === 'video' && (
                        <div className="ratio ratio-16x9">
                          <video controls className="rounded">
                            <source src={course.mediaUrl} type={`video/${course.mediaUrl.split('.').pop().toLowerCase()}`} />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      
                      {course.mediaType === 'audio' && (
                        <div className="mt-3">
                          <audio controls className="w-100">
                            <source src={course.mediaUrl} type={`audio/${course.mediaUrl.split('.').pop().toLowerCase()}`} />
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                      )}
                      
                      {course.mediaType === 'document' && (
                        <div className="text-center mt-3">
                          <Button 
                            variant="primary"
                            href={course.mediaUrl}
                            target="_blank"
                          >
                            <i className="bi bi-file-earmark-text me-2"></i>
                            View Document
                          </Button>
                        </div>
                      )}
                      
                      {course.mediaType === 'other' && (
                        <div className="text-center mt-3">
                          <Button 
                            variant="primary"
                            href={course.mediaUrl}
                            target="_blank"
                          >
                            <i className="bi bi-download me-2"></i>
                            Download Media
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              ) : (
                <p>No media available for this course.</p>
              )}
              
              <h4 className="mt-4">Course Image</h4>
              {course.imageUrl ? (
                <div className="mt-3">
                  <Card className="mb-3">
                    <Card.Img 
                      variant="top" 
                      src={course.imageUrl} 
                      alt={course.title}
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                    <Card.Body>
                      <h5 className="mb-1">Course Image</h5>
                    </Card.Body>
                  </Card>
                </div>
              ) : (
                <p>No course image available.</p>
              )}
            </Tab.Pane>
            
            <Tab.Pane active={activeTab === 'assessments'}>
              <h4>Available Assessments</h4>
              {assessments.length > 0 ? (
                <div className="mt-3">
                  {assessments.map(assessment => (
                    <Card key={assessment.id} className="mb-3">
                      <Card.Body>
                        <Row>
                          <Col md={8}>
                            <h5>{assessment.title}</h5>
                            <div className="text-muted mb-2">
                              <span className="me-3">Questions: {assessment.questions}</span>
                              <span className="me-3">Duration: {assessment.duration}</span>
                              <span>Due: {assessment.dueDate}</span>
                            </div>
                          </Col>
                          <Col md={4} className="d-flex align-items-center justify-content-end">
                            <Button 
                              variant="primary"
                              onClick={() => handleStartAssessment(assessment.id)}
                            >
                              Start Assessment
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No assessments available for this course.</p>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CourseDetail;
