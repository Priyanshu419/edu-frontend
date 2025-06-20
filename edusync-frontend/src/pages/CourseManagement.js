import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert, Button, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService, courseService } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
const CourseManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isInstructor } = useAuth();
  const fileInputRef = useRef(null);
  const mediaFileInputRef = useRef(null);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imageSuccess, setImageSuccess] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [previewMedia, setPreviewMedia] = useState('');
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [mediaSuccess, setMediaSuccess] = useState('');
  
  // Verify the user is an instructor
  useEffect(() => {
    if (!isInstructor()) {
      navigate('/login');
    }
  }, [isInstructor, navigate]);
  
  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle media selection
  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMedia(file);
      
      // Preview the selected media if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewMedia(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, just show the file name
        setPreviewMedia('');
      }
    }
  };
  
  // Trigger file input click
  const handleSelectImageClick = () => {
    fileInputRef.current.click();
  };
  
  // Trigger media file input click
  const handleSelectMediaClick = () => {
    mediaFileInputRef.current.click();
  };
  
  // Upload course image
  const handleImageUpload = async () => {
    if (!selectedImage) {
      setImageError('Please select an image first.');
      return;
    }
    
    setImageLoading(true);
    setImageError('');
    setImageSuccess('');
    
    try {
      // Upload the image using the uploadCourseImage endpoint
      const response = await uploadService.uploadCourseImage(selectedImage, courseId);
      
      // The backend already updates the course with the new image URL
      // Just update the local course state with the returned URL
      setCourse({
        ...course,
        imageUrl: response.data.url
      });
      
      setImageSuccess('Course image updated successfully!');
      setShowImageModal(false);
      
      // Refetch course details to ensure we have the latest data
      fetchCourseDetails();
    } catch (error) {
      console.error('Error uploading course image:', error);
      setImageError('Failed to upload image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };
  
  // Upload course media
  const handleMediaUpload = async () => {
    if (!selectedMedia) {
      setMediaError('Please select a media file first.');
      return;
    }
    
    setMediaLoading(true);
    setMediaError('');
    setMediaSuccess('');
    
    try {
      // Upload the media using the uploadCourseMedia endpoint
      const response = await uploadService.uploadCourseMedia(selectedMedia, courseId);
      
      // The backend already updates the course with the new media URL
      // Just update the local course state with the returned URL
      setCourse({
        ...course,
        mediaUrl: response.data.url
      });
      
      setMediaSuccess('Course media updated successfully!');
      setShowMediaModal(false);
      
      // Refetch course details to ensure we have the latest data
      fetchCourseDetails();
    } catch (error) {
      console.error('Error uploading course media:', error);
      setMediaError('Failed to upload media. Please try again.');
    } finally {
      setMediaLoading(false);
    }
  };
  
  // Function to fetch course details
  const fetchCourseDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch course details
      const courseResponse = await courseService.getCourseById(courseId);
      console.log('Course data received:', courseResponse.data);
      
      setCourse(courseResponse.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to load course details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to determine media type based on URL
  const getMediaType = (url) => {
    if (!url) return 'unknown';
    
    const extension = url.split('.').pop().toLowerCase();
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
  
  // Helper function to render media preview based on type
  const getMediaPreview = (url) => {
    const mediaType = getMediaType(url);
    
    switch (mediaType) {
      case 'image':
        return (
          <div className="text-center">
            <img 
              src={url} 
              alt="Course media" 
              className="img-fluid rounded" 
              style={{ maxHeight: '150px', objectFit: 'contain' }}
            />
          </div>
        );
      case 'video':
        return (
          <div className="d-flex align-items-center">
            <i className="bi bi-film me-2 text-primary" style={{ fontSize: '1.5rem' }}></i>
            <span>Video file</span>
          </div>
        );
      case 'audio':
        return (
          <div className="d-flex align-items-center">
            <i className="bi bi-music-note-beamed me-2 text-primary" style={{ fontSize: '1.5rem' }}></i>
            <span>Audio file</span>
          </div>
        );
      case 'document':
        return (
          <div className="d-flex align-items-center">
            <i className="bi bi-file-earmark-text me-2 text-primary" style={{ fontSize: '1.5rem' }}></i>
            <span>Document file</span>
          </div>
        );
      default:
        return (
          <div className="d-flex align-items-center">
            <i className="bi bi-file-earmark me-2 text-primary" style={{ fontSize: '1.5rem' }}></i>
            <span>Media file</span>
          </div>
        );
    }
  };
  
  // Fetch course details when component mounts
  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);
  
  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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
  
  if (!course) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Course not found</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="my-5">
      <h1 className="mb-4">
        <span className="text-muted">Manage Course:</span> {course.title}
      </h1>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="details" title="Course Details">
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="position-relative">
                    <img
                      src={course.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={course.title}
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-50">
                      <Button
                        variant="light"
                        size="sm"
                        className="w-100"
                        onClick={() => setShowImageModal(true)}
                      >
                        <i className="bi bi-camera me-1"></i> Change Image
                      </Button>
                    </div>
                  </div>
                  
                  {/* Media display section */}
                  {course.mediaUrl && (
                    <div className="mt-3 p-2 border rounded">
                      <h6 className="mb-2">Current Media:</h6>
                      {getMediaPreview(course.mediaUrl)}
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={() => setShowMediaModal(true)}
                    >
                      <i className="bi bi-file-earmark-plus me-1"></i> {course.mediaUrl ? 'Change Media' : 'Add Media'}
                    </Button>
                  </div>
                </Col>
                <Col md={8}>
                  <h3>{course.title}</h3>
                  <p className="text-muted">Instructor: {course.instructor}</p>
                  <hr />
                  <h5>Description</h5>
                  <p>{course.description}</p>
                  <div className="mt-3">
                    <strong>Enrollment Count:</strong> {course.enrollmentCount || 0} students
                  </div>
                  
                  {course.mediaUrl && (
                    <div className="mt-3">
                      <strong>Media URL:</strong> 
                      <a href={course.mediaUrl} target="_blank" rel="noopener noreferrer" className="ms-2">
                        View Media
                      </a>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="enrollments" title="Manage Enrollments">
          <CourseEnrollmentManager courseId={courseId} />
        </Tab>
        <Tab eventKey="assessments" title="Assessments">
          <Card className="shadow-sm">
            <Card.Body>
              <h4>Course Assessments</h4>
              <p>Manage assessments for this course.</p>
              <Button 
                variant="primary"
                onClick={() => navigate(`/instructor/course/${courseId}/assessment/new`)}
              >
                <i className="bi bi-plus-circle me-1"></i> Add New Assessment
              </Button>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
      
      {/* Course Image Upload Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Course Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {imageError && <Alert variant="danger">{imageError}</Alert>}
          {imageSuccess && <Alert variant="success">{imageSuccess}</Alert>}
          
          <div className="text-center mb-3">
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="Course preview" 
                className="img-fluid rounded"
                style={{ maxHeight: '200px', objectFit: 'contain' }} 
              />
            ) : (
              <div 
                className="bg-light d-flex align-items-center justify-content-center rounded"
                style={{ height: '200px' }}
              >
                <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
              </div>
            )}
          </div>
          
          <Form.Group controlId="courseImage">
            <Form.Label>Select an image for the course</Form.Label>
            <Form.Control 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="mb-3"
            />
            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowImageModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleImageUpload}
                disabled={!selectedImage || imageLoading}
              >
                {imageLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Uploading...
                  </>
                ) : (
                  'Upload Image'
                )}
              </Button>
            </div>
          </Form.Group>
        </Modal.Body>
      </Modal>
      
      {/* Course Media Upload Modal */}
      <Modal show={showMediaModal} onHide={() => setShowMediaModal(false)}>        
        <Modal.Header closeButton>
          <Modal.Title>Add Course Media</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mediaError && <Alert variant="danger">{mediaError}</Alert>}
          {mediaSuccess && <Alert variant="success">{mediaSuccess}</Alert>}
          
          <div className="text-center mb-3">
            {previewMedia ? (
              <img 
                src={previewMedia} 
                alt="Media preview" 
                className="img-fluid rounded"
                style={{ maxHeight: '200px', objectFit: 'contain' }} 
              />
            ) : (
              <div 
                className="bg-light d-flex align-items-center justify-content-center rounded"
                style={{ height: '200px' }}
              >
                <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
              </div>
            )}
          </div>
          
          <Form.Group controlId="courseMedia">
            <Form.Label>Select media for the course (video, audio, PDF, etc.)</Form.Label>
            <Form.Control 
              type="file" 
              ref={mediaFileInputRef}
              onChange={handleMediaSelect}
              className="mb-3"
            />
            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowMediaModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleMediaUpload}
                disabled={!selectedMedia || mediaLoading}
              >
                {mediaLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Uploading...
                  </>
                ) : (
                  'Upload Media'
                )}
              </Button>
            </div>
          </Form.Group>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CourseManagement;