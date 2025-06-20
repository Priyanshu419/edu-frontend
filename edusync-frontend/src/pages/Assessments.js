import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService, courseService } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Assessments = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isInstructor } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    questions: []
  });
  
  // Fetch course and assessments
  useEffect(() => {
    // Redirect if not authenticated or not an instructor
    if (!isAuthenticated() || !isInstructor()) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await courseService.getCourseById(courseId);
        setCourse(courseResponse.data);
        
        // Fetch assessments for the course
        const assessmentResponse = await assessmentService.getAssessments();
        const courseAssessments = assessmentResponse.data.filter(
          assessment => assessment.courseId === parseInt(courseId)
        );
        setAssessments(courseAssessments);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, navigate, isAuthenticated, isInstructor]);
  
  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'timeLimit' ? parseInt(value) : value
    });
  };
  
  // Handle form submission for creating a new assessment
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const assessmentData = {
        ...formData,
        courseId: parseInt(courseId),
        courseTitle: course.title,
        questions: formData.questions || []
      };
      
      const response = await assessmentService.createAssessment(assessmentData);
      
      // Force fetch assessments after creation to ensure we have the latest data
      const assessmentResponse = await assessmentService.getAssessments();
      const courseAssessments = assessmentResponse.data.filter(
        assessment => assessment.courseId === parseInt(courseId)
      );
      setAssessments(courseAssessments);
      
      setShowCreateModal(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        timeLimit: 30,
        questions: []
      });
      
    } catch (err) {
      console.error('Error creating assessment:', err);
      setError('Failed to create assessment. Please try again.');
    }
  };
  
  // Handle form submission for updating an assessment
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const assessmentData = {
        ...formData,
        courseId: parseInt(courseId),
        courseTitle: course.title
      };
      
      await assessmentService.updateAssessment(currentAssessment.id, assessmentData);
      
      // Force fetch assessments after update to ensure we have the latest data
      const assessmentResponse = await assessmentService.getAssessments();
      const courseAssessments = assessmentResponse.data.filter(
        assessment => assessment.courseId === parseInt(courseId)
      );
      setAssessments(courseAssessments);
      
      setShowEditModal(false);
      
    } catch (err) {
      console.error('Error updating assessment:', err);
      setError('Failed to update assessment. Please try again.');
    }
  };
  
  // Handle assessment deletion
  const handleDelete = async () => {
    try {
      await assessmentService.deleteAssessment(currentAssessment.id);
      
      // Remove deleted assessment from the list
      const updatedAssessments = assessments.filter(
        assessment => assessment.id !== currentAssessment.id
      );
      
      setAssessments(updatedAssessments);
      setShowDeleteModal(false);
      
    } catch (err) {
      console.error('Error deleting assessment:', err);
      setError('Failed to delete assessment. Please try again.');
    }
  };
  
  // Edit assessment handler
  const handleEdit = (assessment) => {
    setCurrentAssessment(assessment);
    setFormData({
      title: assessment.title,
      description: assessment.description || '',
      timeLimit: assessment.timeLimit || 30,
      questions: assessment.questions || []
    });
    setShowEditModal(true);
  };
  
  // Add question to the form
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(), // Temporary ID for the UI
      text: '',
      options: [
        { id: Date.now() + 1, text: '', isCorrect: true },
        { id: Date.now() + 2, text: '', isCorrect: false },
        { id: Date.now() + 3, text: '', isCorrect: false },
        { id: Date.now() + 4, text: '', isCorrect: false }
      ]
    };
    
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };
  
  // Update question in the form
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  // Update option in the form
  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    
    // If changing the isCorrect field, update all options
    if (field === 'isCorrect' && value === true) {
      // Set all options to false first
      updatedQuestions[questionIndex].options.forEach((option, i) => {
        updatedQuestions[questionIndex].options[i].isCorrect = false;
      });
    }
    
    // Update the specific option
    updatedQuestions[questionIndex].options[optionIndex] = {
      ...updatedQuestions[questionIndex].options[optionIndex],
      [field]: field === 'isCorrect' ? value === true : value
    };
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  // Remove question from the form
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  // View assessment results
  const handleViewResults = (assessmentId) => {
    navigate(`/assessments/${assessmentId}/results`);
  };
  
  // Create new assessment modal
  const renderCreateModal = () => (
    <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Assessment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleCreateSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Time Limit (minutes)</Form.Label>
            <Form.Control
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleInputChange}
              min={5}
              max={180}
              required
            />
          </Form.Group>
          
          <div className="questions-section mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Questions</h5>
              <Button variant="outline-primary" onClick={handleAddQuestion}>
                <i className="bi bi-plus"></i> Add Question
              </Button>
            </div>
            
            {formData.questions.length === 0 && (
              <Alert variant="info">
                No questions added yet. Click "Add Question" to create questions.
              </Alert>
            )}
            
            {formData.questions.map((question, qIndex) => (
              <Card key={qIndex} className="mb-3">
                <Card.Header className="d-flex justify-content-between">
                  <span>Question {qIndex + 1}</span>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleRemoveQuestion(qIndex)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Text</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Label>Options (select one correct answer)</Form.Label>
                  {question.options.map((option, oIndex) => (
                    <Row key={oIndex} className="mb-2">
                      <Col xs={8}>
                        <Form.Control
                          type="text"
                          placeholder={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                          required
                        />
                      </Col>
                      <Col xs={4}>
                        <Form.Check
                          type="radio"
                          name={`correct-option-${qIndex}`}
                          label="Correct"
                          checked={option.isCorrect}
                          onChange={() => handleOptionChange(qIndex, oIndex, 'isCorrect', true)}
                        />
                      </Col>
                    </Row>
                  ))}
                </Card.Body>
              </Card>
            ))}
          </div>
          
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Assessment
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
  
  // Edit assessment modal
  const renderEditModal = () => (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Assessment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEditSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Time Limit (minutes)</Form.Label>
            <Form.Control
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleInputChange}
              min={5}
              max={180}
              required
            />
          </Form.Group>
          
          <div className="questions-section mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Questions</h5>
              <Button variant="outline-primary" onClick={handleAddQuestion}>
                <i className="bi bi-plus"></i> Add Question
              </Button>
            </div>
            
            {formData.questions.length === 0 && (
              <Alert variant="info">
                No questions added yet. Click "Add Question" to create questions.
              </Alert>
            )}
            
            {formData.questions.map((question, qIndex) => (
              <Card key={qIndex} className="mb-3">
                <Card.Header className="d-flex justify-content-between">
                  <span>Question {qIndex + 1}</span>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleRemoveQuestion(qIndex)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Text</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Label>Options (select one correct answer)</Form.Label>
                  {question.options.map((option, oIndex) => (
                    <Row key={oIndex} className="mb-2">
                      <Col xs={8}>
                        <Form.Control
                          type="text"
                          placeholder={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                          required
                        />
                      </Col>
                      <Col xs={4}>
                        <Form.Check
                          type="radio"
                          name={`correct-option-${qIndex}`}
                          label="Correct"
                          checked={option.isCorrect}
                          onChange={() => handleOptionChange(qIndex, oIndex, 'isCorrect', true)}
                        />
                      </Col>
                    </Row>
                  ))}
                </Card.Body>
              </Card>
            ))}
          </div>
          
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={() => setShowEditModal(false)} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
  
  // Delete confirmation modal
  const renderDeleteModal = () => (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the assessment "{currentAssessment?.title}"?</p>
        <p className="text-danger">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete Assessment
        </Button>
      </Modal.Footer>
    </Modal>
  );
  
  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading assessments...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Assessments for {course?.title}</h2>
          <p className="text-muted">Manage quizzes, tests, and assignments for this course</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle me-1"></i> Create Assessment
        </Button>
      </div>
      
      {assessments.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <i className="bi bi-clipboard-x display-1 text-muted"></i>
            <h4 className="mt-3">No Assessments Created</h4>
            <p className="text-muted">Create your first assessment for this course.</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <i className="bi bi-plus-circle me-1"></i> Create Assessment
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Questions</th>
              <th>Time Limit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map(assessment => (
              <tr key={assessment.id}>
                <td>{assessment.title}</td>
                <td>{assessment.questions?.length || 0} questions</td>
                <td>{assessment.timeLimit} minutes</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleViewResults(assessment.id)}
                  >
                    <i className="bi bi-bar-chart"></i> Results
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(assessment)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setCurrentAssessment(assessment);
                      setShowDeleteModal(true);
                    }}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      {/* Modals */}
      {renderCreateModal()}
      {renderEditModal()}
      {renderDeleteModal()}
    </Container>
  );
};

export default Assessments;
