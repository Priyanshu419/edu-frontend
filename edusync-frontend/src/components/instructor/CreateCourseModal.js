import React, { useState, useRef } from 'react';
import { Modal, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { courseService } from '../../utils/api';
import { toast } from 'react-toastify';

const CreateCourseModal = ({ show, onHide, onCreateCourse }) => {
  // File upload refs
  const courseImageRef = useRef(null);
  const courseVideoRef = useRef(null);
  const courseFilesRef = useRef(null);
  
  // State for course form
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    level: 'Beginner',
    content: '',
    imageFile: null,
    videoFile: null,
    additionalFiles: []
  });
  
  const [courseImagePreview, setCourseImagePreview] = useState('');
  const [courseVideoPreview, setCourseVideoPreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [courseFormError, setCourseFormError] = useState('');
  
  // Handle file uploads for course images
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setCourseFormError('Please upload a valid image file (JPG, JPEG, or PNG)');
      return;
    }
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setCourseImagePreview(previewUrl);
    
    // Update form state
    setCourseForm({
      ...courseForm,
      imageFile: file
    });
    
    setCourseFormError('');
  };
  
  // Handle file uploads for course videos
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      setCourseFormError('Please upload a valid video file (MP4, WebM, or OGG)');
      return;
    }
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setCourseVideoPreview(previewUrl);
    
    // Update form state
    setCourseForm({
      ...courseForm,
      videoFile: file
    });
    
    setCourseFormError('');
  };
  
  // Handle multiple file uploads
  const handleFilesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Validate file types
    const validTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'text/plain'
    ];
    
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setCourseFormError(`Some files have invalid types. Please upload PDF, DOC, DOCX, PPT, PPTX, ZIP, or TXT files.`);
      return;
    }
    
    // Update form state
    setCourseForm({
      ...courseForm,
      additionalFiles: [...courseForm.additionalFiles, ...files]
    });
    
    setCourseFormError('');
  };
  
  // Remove a file from the additional files list
  const handleRemoveFile = (index) => {
    const updatedFiles = [...courseForm.additionalFiles];
    updatedFiles.splice(index, 1);
    
    setCourseForm({
      ...courseForm,
      additionalFiles: updatedFiles
    });
  };
  
  // Reset course form
  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      category: '',
      duration: '',
      level: 'Beginner',
      content: '',
      imageFile: null,
      videoFile: null,
      additionalFiles: []
    });
    setCourseImagePreview('');
    setCourseVideoPreview('');
    setCourseFormError('');
    setUploadProgress(0);
  };

  // Handle course form change
  const handleCourseFormChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({
      ...courseForm,
      [name]: value
    });
  };

  // Handle course form submit
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setCourseFormError('');
    
    // Validate form
    if (!courseForm.title || !courseForm.description || !courseForm.category || !courseForm.duration) {
      setCourseFormError('Please fill in all required fields');
      return;
    }
    
    if (!courseForm.imageFile) {
      setCourseFormError('Please upload a course thumbnail image');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('title', courseForm.title);
      formData.append('description', courseForm.description);
      formData.append('category', courseForm.category);
      formData.append('duration', courseForm.duration);
      formData.append('level', courseForm.level);
      formData.append('content', courseForm.content);
      
      // Append files
      if (courseForm.imageFile) {
        formData.append('image', courseForm.imageFile);
      }
      
      if (courseForm.videoFile) {
        formData.append('video', courseForm.videoFile);
      }
      
      // Append additional files
      courseForm.additionalFiles.forEach((file, index) => {
        formData.append(`additionalFile${index}`, file);
      });
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Send request to API
      const response = await courseService.createCourse(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Call the onCreateCourse callback with the new course
      if (onCreateCourse) {
        onCreateCourse(response.data);
      }
      
      // Show success message
      toast.success('Course created successfully!');
      
      // Close modal and reset form
      setTimeout(() => {
        onHide();
        resetCourseForm();
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error creating course:', error);
      setCourseFormError('Failed to create course. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {courseFormError && (
          <Alert variant="danger">{courseFormError}</Alert>
        )}
        
        <Form onSubmit={handleCourseSubmit}>
          <Form.Group className="mb-3" controlId="courseTitle">
            <Form.Label>Course Title <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={courseForm.title}
              onChange={handleCourseFormChange}
              placeholder="Enter course title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="courseDescription">
            <Form.Label>Course Description <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={courseForm.description}
              onChange={handleCourseFormChange}
              placeholder="Enter course description"
              required
            />
          </Form.Group>
          
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="courseCategory">
                <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={courseForm.category}
                  onChange={handleCourseFormChange}
                  placeholder="e.g. Development, Data Science"
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="courseDuration">
                <Form.Label>Duration <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  value={courseForm.duration}
                  onChange={handleCourseFormChange}
                  placeholder="e.g. 8 weeks, 10 hours"
                  required
                />
              </Form.Group>
            </div>
          </div>
          
          <Form.Group className="mb-3" controlId="courseLevel">
            <Form.Label>Level</Form.Label>
            <Form.Select
              name="level"
              value={courseForm.level}
              onChange={handleCourseFormChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="courseContent">
            <Form.Label>Course Content Overview</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="content"
              value={courseForm.content}
              onChange={handleCourseFormChange}
              placeholder="Enter course content overview"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="courseImage">
            <Form.Label>Course Image <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="file"
              ref={courseImageRef}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Form.Text className="text-muted">
              Upload a cover image for your course (JPG, JPEG, or PNG).
            </Form.Text>
            {courseImagePreview && (
              <div className="mt-2">
                <img 
                  src={courseImagePreview} 
                  alt="Course preview" 
                  className="img-thumbnail" 
                  style={{ maxHeight: '150px' }} 
                />
              </div>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="courseVideo">
            <Form.Label>Course Introduction Video</Form.Label>
            <Form.Control
              type="file"
              ref={courseVideoRef}
              accept="video/*"
              onChange={handleVideoUpload}
            />
            <Form.Text className="text-muted">
              Upload an introduction video for your course (MP4, WebM, or OGG).
            </Form.Text>
            {courseVideoPreview && (
              <div className="mt-2">
                <video 
                  src={courseVideoPreview} 
                  controls 
                  className="img-thumbnail" 
                  style={{ maxHeight: '150px' }} 
                />
              </div>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="additionalFiles">
            <Form.Label>Additional Course Files</Form.Label>
            <Form.Control
              type="file"
              ref={courseFilesRef}
              multiple
              onChange={handleFilesUpload}
            />
            <Form.Text className="text-muted">
              Upload additional files for your course (PDF, DOC, DOCX, PPT, PPTX, ZIP, or TXT).
            </Form.Text>
            {courseForm.additionalFiles.length > 0 && (
              <div className="mt-2">
                <p className="mb-1">Selected files:</p>
                <ul className="list-group">
                  {courseForm.additionalFiles.map((file, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Form.Group>
          
          {isUploading && (
            <div className="mb-3">
              <p className="mb-1">Uploading course...</p>
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                variant={uploadProgress < 100 ? "primary" : "success"} 
              />
            </div>
          )}

          <div className="d-flex justify-content-end mt-4">
            <Button 
              variant="secondary" 
              className="me-2" 
              onClick={onHide}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isUploading}
            >
              {isUploading ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCourseModal;
