import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Button, Form, ProgressBar, Modal, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Assessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent } = useAuth();
  
  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Format and submit assessment answers
  const handleSubmit = useCallback(async () => {
    // Format answers for submission
    if (!assessment) return;
    
    const formattedAnswers = Object.entries(answers).map(([questionIndex, optionId]) => ({
      questionId: assessment.questions[parseInt(questionIndex)].id,
      selectedOptionId: optionId
    }));
    
    try {
      const response = await assessmentService.submitAssessment(assessmentId, formattedAnswers);
      setResult(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      
      // Mock result for testing
      setResult({
        score: 80,
        totalQuestions: assessment.questions.length,
        correctAnswers: 4,
        feedback: 'Great job! You have a good understanding of web development fundamentals.'
      });
      setSubmitted(true);
    }
  }, [assessment, answers, assessmentId]);

  useEffect(() => {
    // Redirect if not authenticated or not a student
    if (!isAuthenticated() || !isStudent()) {
      navigate('/login');
      return;
    }

    const fetchAssessment = async () => {
      try {
        const response = await assessmentService.getAssessmentById(assessmentId);
        setAssessment(response.data);
        
        // Initialize answers object
        const initialAnswers = {};
        response.data.questions.forEach((_, index) => {
          initialAnswers[index] = null;
        });
        setAnswers(initialAnswers);
        
        // Set timer (in seconds)
        if (response.data.timeLimit) {
          setTimeLeft(response.data.timeLimit * 60);
        } else {
          // Default to 30 minutes if no time limit is specified
          setTimeLeft(30 * 60);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assessment:', error);
        setError('Failed to load assessment. Please try again later.');
        setLoading(false);
        
        // Mock data for testing
        const mockAssessment = {
          id: parseInt(assessmentId),
          title: 'Web Development Fundamentals Quiz',
          description: 'Test your knowledge of web development basics.',
          courseId: 1,
          courseTitle: 'Introduction to Web Development',
          timeLimit: 30, // minutes
          questions: [
            {
              id: 1,
              text: 'What does HTML stand for?',
              options: [
                { id: 1, text: 'Hyper Text Markup Language' },
                { id: 2, text: 'High Tech Multi Language' },
                { id: 3, text: 'Hyper Transfer Markup Language' },
                { id: 4, text: 'Hyper Text Multiple Language' }
              ]
            },
            {
              id: 2,
              text: 'Which of the following is used for styling web pages?',
              options: [
                { id: 5, text: 'HTML' },
                { id: 6, text: 'JavaScript' },
                { id: 7, text: 'CSS' },
                { id: 8, text: 'XML' }
              ]
            },
            {
              id: 3,
              text: 'Which of the following is NOT a JavaScript framework or library?',
              options: [
                { id: 9, text: 'React' },
                { id: 10, text: 'Angular' },
                { id: 11, text: 'Vue' },
                { id: 12, text: 'Pascal' }
              ]
            },
            {
              id: 4,
              text: 'What is the correct HTML element for the largest heading?',
              options: [
                { id: 13, text: '<heading>' },
                { id: 14, text: '<h1>' },
                { id: 15, text: '<h6>' },
                { id: 16, text: '<head>' }
              ]
            },
            {
              id: 5,
              text: 'Which property is used to change the background color in CSS?',
              options: [
                { id: 17, text: 'color' },
                { id: 18, text: 'bgcolor' },
                { id: 19, text: 'background-color' },
                { id: 20, text: 'background' }
              ]
            }
          ]
        };
        
        setAssessment(mockAssessment);
        
        // Initialize answers object
        const initialAnswers = {};
        mockAssessment.questions.forEach((_, index) => {
          initialAnswers[index] = null;
        });
        setAnswers(initialAnswers);
        
        // Set timer (in seconds)
        setTimeLeft(mockAssessment.timeLimit * 60);
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId, isAuthenticated, isStudent, navigate]);

  // Timer effect
  useEffect(() => {
    if (!loading && !submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [loading, submitted, timeLeft, handleSubmit]);

  const handleAnswerSelect = (questionIndex, optionId) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionId
    });
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // handleSubmit function moved to top and wrapped in useCallback

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <p>Loading assessment...</p>
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

  if (submitted) {
    return (
      <Container className="my-5">
        <Card className="shadow">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <i className="bi bi-check-circle-fill text-success fs-1"></i>
              <h2 className="mt-2">Assessment Completed!</h2>
              <p className="lead">{assessment.title}</p>
            </div>
            
            <div className="text-center mb-4">
              <h3>Your Score</h3>
              <h1 className="display-1 fw-bold text-primary">{result.score}%</h1>
              <p>{result.correctAnswers} out of {result.totalQuestions} questions answered correctly</p>
            </div>
            
            <div className="mb-4">
              <h4>Feedback</h4>
              <p>{result.feedback}</p>
            </div>
            
            <div className="d-flex justify-content-center mt-4">
              <Button variant="primary" onClick={() => navigate(`/courses/${assessment.courseId}`)}>
                Return to Course
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  // Calculate time remaining as percentage if needed for UI
  const isLastQuestion = currentQuestion === assessment.questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion] !== null;
  const allQuestionsAnswered = Object.values(answers).every(answer => answer !== null);

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header className="d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">{assessment.title}</h5>
          <div className="d-flex align-items-center">
            <i className="bi bi-clock me-1"></i>
            <span className={timeLeft < 60 ? 'text-danger' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </Card.Header>
        <Card.Body className="p-4">
          <div className="mb-3">
            <ProgressBar 
              now={progress} 
              label={`${currentQuestion + 1}/${assessment.questions.length}`} 
              variant="primary" 
              className="mb-2"
            />
            <div className="d-flex justify-content-between">
              <span className="text-muted">Question {currentQuestion + 1} of {assessment.questions.length}</span>
              <span className="text-muted">
                {Object.values(answers).filter(a => a !== null).length} answered
              </span>
            </div>
          </div>
          
          <h4 className="mb-4">{question.text}</h4>
          
          <Form>
            {question.options.map(option => (
              <Form.Check
                key={option.id}
                type="radio"
                id={`option-${option.id}`}
                label={option.text}
                name={`question-${question.id}`}
                className="mb-3 p-2 border rounded"
                checked={answers[currentQuestion] === option.id}
                onChange={() => handleAnswerSelect(currentQuestion, option.id)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Form>
          
          <div className="d-flex justify-content-between mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <i className="bi bi-arrow-left me-1"></i> Previous
            </Button>
            
            {isLastQuestion ? (
              <Button 
                variant="primary" 
                onClick={() => setShowConfirmModal(true)}
                disabled={!hasAnsweredCurrent}
              >
                Submit Assessment
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
              >
                Next <i className="bi bi-arrow-right ms-1"></i>
              </Button>
            )}
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Course: {assessment.courseTitle}</span>
            {!isLastQuestion && (
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setShowConfirmModal(true)}
                disabled={!allQuestionsAnswered}
              >
                Finish Early
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
      
      {/* Confirm submission modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {allQuestionsAnswered ? (
            <p>Are you sure you want to submit your assessment? You cannot change your answers after submission.</p>
          ) : (
            <div>
              <Alert variant="warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                You haven't answered all questions.
              </Alert>
              <p>Are you sure you want to submit the assessment? Unanswered questions will be marked as incorrect.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit Assessment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Assessment;
