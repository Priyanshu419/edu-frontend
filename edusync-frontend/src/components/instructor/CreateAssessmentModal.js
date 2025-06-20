import React, { useState } from 'react';
import { Modal, Form, Button, Card, Alert } from 'react-bootstrap';
import { assessmentService } from '../../utils/api';
import { toast } from 'react-toastify';

const CreateAssessmentModal = ({ show, onHide, courses, onCreateAssessment }) => {
  // Debug: Log courses prop
  console.log('Courses prop received in modal:', courses);
  // State for assessment form
  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    courseId: '',
    questions: [{ text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }]
  });
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle assessment form change
  const handleAssessmentFormChange = (e) => {
    const { name, value } = e.target;
    setAssessmentForm({
      ...assessmentForm,
      [name]: value
    });
  };

  // Handle adding a question to assessment
  const handleAddQuestion = () => {
    setAssessmentForm({
      ...assessmentForm,
      questions: [
        ...assessmentForm.questions,
        { text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }
      ]
    });
  };

  // Handle question text change
  const handleQuestionChange = (index, e) => {
    const newQuestions = [...assessmentForm.questions];
    newQuestions[index].text = e.target.value;
    setAssessmentForm({
      ...assessmentForm,
      questions: newQuestions
    });
  };

  // Handle option text change
  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const newQuestions = [...assessmentForm.questions];
    newQuestions[questionIndex].options[optionIndex].text = e.target.value;
    setAssessmentForm({
      ...assessmentForm,
      questions: newQuestions
    });
  };

  // Handle correct option change
  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const newQuestions = [...assessmentForm.questions];
    // Reset all options for this question
    newQuestions[questionIndex].options.forEach((option, idx) => {
      option.isCorrect = idx === optionIndex;
    });
    setAssessmentForm({
      ...assessmentForm,
      questions: newQuestions
    });
  };

  // Handle adding an option to a question
  const handleAddOption = (questionIndex) => {
    const newQuestions = [...assessmentForm.questions];
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setAssessmentForm({
      ...assessmentForm,
      questions: newQuestions
    });
  };
  
  // Handle removing an option from a question
  const handleRemoveOption = (questionIndex, optionIndex) => {
    const newQuestions = [...assessmentForm.questions];
    // Ensure we have at least 2 options
    if (newQuestions[questionIndex].options.length <= 2) {
      setFormError('Each question must have at least 2 options');
      return;
    }
    
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    
    // Check if we removed the correct option
    const hasCorrectOption = newQuestions[questionIndex].options.some(option => option.isCorrect);
    if (!hasCorrectOption && newQuestions[questionIndex].options.length > 0) {
      // Set the first option as correct if no correct option exists
      newQuestions[questionIndex].options[0].isCorrect = true;
    }
    
    setAssessmentForm({
      ...assessmentForm,
      questions: newQuestions
    });
    setFormError('');
  };
  
  // Handle removing a question
  const handleRemoveQuestion = (questionIndex) => {
    // Ensure we have at least 1 question
    if (assessmentForm.questions.length <= 1) {
      setFormError('Assessment must have at least 1 question');
      return;
    }
    
    const newQuestions = [...assessmentForm.questions];
    newQuestions.splice(questionIndex, 1);
    
    setAssessmentForm({
      ...assessmentForm,
      questions: newQuestions
    });
    setFormError('');
  };

  // Reset form
  const resetForm = () => {
    setAssessmentForm({
      title: '',
      courseId: '',
      questions: [{ text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }]
    });
    setFormError('');
  };

  // Handle assessment form submit
  const handleAssessmentSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!assessmentForm.title || !assessmentForm.courseId) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    // Validate questions
    const invalidQuestions = assessmentForm.questions.filter(q => !q.text);
    if (invalidQuestions.length > 0) {
      setFormError('All questions must have text');
      return;
    }
    
    // Validate options
    let invalidOptions = false;
    assessmentForm.questions.forEach(question => {
      // Check if all options have text
      if (question.options.some(option => !option.text)) {
        invalidOptions = true;
      }
      
      // Check if each question has a correct option
      if (!question.options.some(option => option.isCorrect)) {
        invalidOptions = true;
      }
    });
    
    if (invalidOptions) {
      setFormError('All options must have text and each question must have a correct answer');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format the assessment data
      const assessmentData = {
        title: assessmentForm.title,
        courseId: parseInt(assessmentForm.courseId),
        questions: assessmentForm.questions.map(q => ({
          text: q.text,
          options: q.options.map(o => ({
            text: o.text,
            isCorrect: o.isCorrect
          }))
        }))
      };
      
      // Send request to API
      const response = await assessmentService.createAssessment(assessmentData);
      
      // Call the onCreateAssessment callback with the new assessment
      if (onCreateAssessment) {
        onCreateAssessment(response.data);
      }
      
      // Show success message
      toast.success('Assessment created successfully!');
      
      // Close modal and reset form
      onHide();
      resetForm();
    } catch (error) {
      console.error('Error creating assessment:', error);
      setFormError(error.response?.data?.message || 'Failed to create assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Assessment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formError && (
          <Alert variant="danger">{formError}</Alert>
        )}
        
        <Form onSubmit={handleAssessmentSubmit}>
          <Form.Group className="mb-3" controlId="assessmentTitle">
            <Form.Label>Assessment Title <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={assessmentForm.title}
              onChange={handleAssessmentFormChange}
              placeholder="Enter assessment title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="assessmentCourse">
            <Form.Label>Select Course <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="courseId"
              value={assessmentForm.courseId}
              onChange={handleAssessmentFormChange}
              required
            >
              <option value="">Select a course...</option>
              {courses && courses.length > 0 ? (
                courses.map(course => {
                  console.log('Rendering course option:', course);
                  return (
                    <option key={course.courseId} value={course.courseId}>
                      {course.title}
                    </option>
                  );
                })
              ) : (
                <option disabled>No courses available</option>
              )}
            </Form.Select>
          </Form.Group>

          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Questions</h5>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleAddQuestion}
            >
              <i className="bi bi-plus-circle me-2"></i> Add Question
            </Button>
          </div>

          {assessmentForm.questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                <h6 className="mb-0">Question {questionIndex + 1}</h6>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleRemoveQuestion(questionIndex)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3" controlId={`question-${questionIndex}`}>
                  <Form.Label>Question Text <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(questionIndex, e)}
                    placeholder="Enter question text"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label>Options <span className="text-danger">*</span></Form.Label>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => handleAddOption(questionIndex)}
                    >
                      <i className="bi bi-plus-circle me-1"></i> Add Option
                    </Button>
                  </div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="d-flex align-items-center mb-2">
                      <Form.Check
                        type="radio"
                        name={`correct-option-${questionIndex}`}
                        checked={option.isCorrect}
                        onChange={() => handleCorrectOptionChange(questionIndex, optionIndex)}
                        className="me-2"
                      />
                      <Form.Control
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                        className="me-2"
                      />
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    </div>
                  ))}
                  <Form.Text className="text-muted">
                    Select the radio button next to the correct answer.
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>
          ))}

          <div className="d-flex justify-content-end mt-4">
            <Button 
              variant="secondary" 
              className="me-2" 
              onClick={onHide}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Assessment'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateAssessmentModal;
