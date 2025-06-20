import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tab, ListGroup, Badge, ProgressBar, Alert, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { courseService, assessmentService, userService } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { FaBook, FaChartLine, FaCalendarAlt, FaGraduationCap, FaUserGraduate, FaLaptopCode, FaCertificate } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

// Custom styles for the light purple theme
const styles = {
  container: {
    backgroundColor: '#f8f5ff',
    minHeight: '100vh',
    padding: '2rem 0'
  },
  card: {
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)'
    }
  },
  statCard: {
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem'
  },
  statValue: {
    color: '#6f42c1',
    fontSize: '2.5rem',
    fontWeight: 'bold'
  },
  statLabel: {
    color: '#6c757d',
    fontSize: '1rem'
  },
  tabContent: {
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem'
  },
  listGroupItem: {
    border: 'none',
    borderBottom: '1px solid #f0f0f0',
    padding: '1rem',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  progressBar: {
    backgroundColor: '#e9ecef',
    '& .progress-bar': {
      backgroundColor: '#6f42c1'
    }
  },
  hero: {
    background: 'linear-gradient(135deg, #6f42c1 0%, #4a2b8c 100%)',
    color: 'white',
    padding: '4rem 0',
    marginBottom: '2rem'
  },
  section: {
    padding: '3rem 0'
  },
  featureIcon: {
    fontSize: '2.5rem',
    color: '#6f42c1',
    marginBottom: '1rem'
  }
};

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [upcomingAssessments, setUpcomingAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const [showStudySchedule, setShowStudySchedule] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [learningPath, setLearningPath] = useState([]);
  const [performanceTrend, setPerformanceTrend] = useState([]);

  // Function to retry loading data
  const retryFetchData = async () => {
    setRetrying(true);
    setError('');
    try {
      await fetchData();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setRetrying(false);
    }
  };

  // Generate intelligent study schedule
  const generateStudySchedule = () => {
    const schedule = [];
    const today = new Date();
    
    // Sort assessments by due date
    const sortedAssessments = [...upcomingAssessments].sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    );

    // Generate schedule for next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const daySchedule = {
        date: date.toISOString().split('T')[0],
        tasks: []
      };

      // Add assessments due in the next 7 days
      sortedAssessments.forEach(assessment => {
        const dueDate = new Date(assessment.dueDate);
        const daysUntilDue = Math.ceil((dueDate - date) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue >= 0 && daysUntilDue <= 7) {
          daySchedule.tasks.push({
            type: 'assessment',
            title: assessment.title,
            course: assessment.courseTitle,
            priority: daysUntilDue <= 2 ? 'high' : 'medium'
          });
        }
      });

      // Add course study sessions based on progress
      enrolledCourses.forEach(course => {
        if (course.progress < 100) {
          daySchedule.tasks.push({
            type: 'study',
            title: course.title,
            progress: course.progress,
            priority: course.progress < 30 ? 'high' : 'medium'
          });
        }
      });

      schedule.push(daySchedule);
    }

    return schedule;
  };

  // Main data fetching function
  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      let userProfileCourses = [];

      // Fetch user profile to get enrolled courses directly
      try {
        console.log('Fetching user profile for enrolled courses and other data:', currentUser.id);
        const profileResponse = await userService.getProfile();
        console.log('User profile response:', profileResponse);

        if (profileResponse && profileResponse.data && profileResponse.data.courses) {
          userProfileCourses = profileResponse.data.courses.map(course => ({
            id: course.courseId,
            title: course.title || 'Untitled Course',
            description: course.description || 'No description available',
            instructor: course.instructorId || 'Unknown Instructor',
            progress: course.progress || 0,
            imageUrl: course.mediaUrl || null
          }));
          setEnrolledCourses(userProfileCourses);
        } else {
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error('Error fetching user profile/enrolled courses:', error);
        setEnrolledCourses([]);
      }

      // Fetch assessment results
      try {
        console.log('Fetching assessment results for user:', currentUser.id);
        const resultsResponse = await assessmentService.getStudentResults(currentUser.id);
        console.log('Assessment results response:', resultsResponse);
        
        if (resultsResponse && resultsResponse.data) {
          const mappedResults = resultsResponse.data.map(result => ({
            id: result.resultId,
            title: result.assessmentTitle || 'Untitled Assessment',
            courseId: result.courseId,
            courseTitle: result.courseTitle || 'Unknown Course',
            score: result.score || 0,
            totalScore: result.totalScore || 100,
            date: result.submittedDate ? new Date(result.submittedDate).toLocaleDateString() : 'No date'
          }));
          setAssessmentResults(mappedResults);
        } else {
          setAssessmentResults([]);
        }
      } catch (error) {
        console.error('Error fetching assessment results:', error);
        setAssessmentResults([]);
      }

      // Fetch upcoming assessments (using all assessments and filtering by enrolled courses)
      try {
        console.log('Fetching all assessments');
        const assessmentsResponse = await assessmentService.getAssessments();
        console.log('Assessments response:', assessmentsResponse);
        
        if (assessmentsResponse && assessmentsResponse.data) {
          const now = new Date();
          const mappedAssessments = assessmentsResponse.data
            .filter(assessment => {
              const dueDate = new Date(assessment.dueDate);
              // Filter assessments that are in the future AND belong to courses the student is enrolled in
              return dueDate > now && userProfileCourses.some(course => course.id === assessment.courseId);
            })
            .map(assessment => ({
              id: assessment.assessmentId,
              title: assessment.title || 'Untitled Assessment',
              courseId: assessment.courseId,
              courseTitle: assessment.courseTitle || 'Unknown Course',
              dueDate: assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : 'No due date'
            }));
          setUpcomingAssessments(mappedAssessments);
        } else {
          setUpcomingAssessments([]);
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setUpcomingAssessments([]);
      }

      // Generate recommendations based on the mapped data
      const recommendations = generateRecommendations();
      setRecommendedCourses(recommendations);

      // Generate performance trend from mapped results
      const trend = assessmentResults
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(result => ({
          date: result.date,
          score: (result.score / result.totalScore) * 100
        }));
      setPerformanceTrend(trend);

      setLoading(false);
    } catch (error) {
      console.error('Error in fetchData:', error);
      setError(error.message || 'Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  };

  // Generate course recommendations based on performance
  const generateRecommendations = () => {
    if (!enrolledCourses.length || !assessmentResults.length) {
      return [];
    }

    // Calculate average scores by course
    const courseScores = assessmentResults.reduce((acc, result) => {
      if (!acc[result.courseId]) {
        acc[result.courseId] = {
          total: 0,
          count: 0,
          title: result.courseTitle
        };
      }
      acc[result.courseId].total += (result.score / result.totalScore) * 100;
      acc[result.courseId].count += 1;
      return acc;
    }, {});

    // Find courses with lowest performance
    const lowPerformingCourses = Object.entries(courseScores)
      .map(([courseId, data]) => ({
        id: courseId,
        title: data.title,
        averageScore: data.total / data.count
      }))
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 3);

    // Generate recommendations based on low performing courses
    return lowPerformingCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: `Based on your performance in ${course.title}, we recommend focusing on this course to improve your understanding.`
    }));
  };

  // Add useEffect to log currentUser changes
  useEffect(() => {
    console.log('Current user changed:', currentUser);
  }, [currentUser]);

  // Add useEffect to log state changes
  useEffect(() => {
    console.log('Enrolled courses updated:', enrolledCourses);
  }, [enrolledCourses]);

  useEffect(() => {
    console.log('Assessment results updated:', assessmentResults);
  }, [assessmentResults]);

  useEffect(() => {
    console.log('Upcoming assessments updated:', upcomingAssessments);
  }, [upcomingAssessments]);

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // Prepare chart data
  const pieChartData = {
    labels: assessmentResults.map(result => result.title),
    datasets: [
      {
        data: assessmentResults.map(result => result.score),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: enrolledCourses.map(course => course.title),
    datasets: [
      {
        label: 'Course Progress (%)',
        data: enrolledCourses.map(course => course.progress),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const performanceTrendData = {
    labels: performanceTrend.map(point => point.date),
    datasets: [
      {
        label: 'Performance Trend',
        data: performanceTrend.map(point => point.score),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Course Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #6f42c1 0%, #4a2b8c 100%)',
        color: 'white',
        padding: '4rem 0',
        marginBottom: '2rem'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-4">Welcome to Your Learning Journey</h1>
              <p className="lead mb-4">
                Track your progress, manage your courses, and achieve your learning goals with our comprehensive dashboard.
              </p>
              <Button variant="light" size="lg" className="me-3">
                Start Learning
              </Button>
              <Button variant="outline-light" size="lg">
                View Courses
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <img 
                src="/images/hero-illustration.svg" 
                alt="Learning Illustration" 
                className="img-fluid"
                style={{ maxWidth: '400px' }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Quick Stats Section */}
      <Container style={{ padding: '3rem 0' }}>
        <Row className="g-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaBook className="text-primary mb-3" size={24} />
                <h3 className="mb-0">{enrolledCourses.length}</h3>
                <p className="text-muted mb-0">Enrolled Courses</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaChartLine className="text-success mb-3" size={24} />
                <h3 className="mb-0">
                  {assessmentResults.length > 0
                    ? Math.round(
                        assessmentResults.reduce((acc, curr) => acc + (curr.score / curr.totalScore) * 100, 0) /
                          assessmentResults.length
                      )
                    : 0}%
                </h3>
                <p className="text-muted mb-0">Average Score</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaCalendarAlt className="text-warning mb-3" size={24} />
                <h3 className="mb-0">{upcomingAssessments.length}</h3>
                <p className="text-muted mb-0">Upcoming Assessments</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaGraduationCap className="text-info mb-3" size={24} />
                <h3 className="mb-0">
                  {enrolledCourses.filter(course => course.progress === 100).length}
                </h3>
                <p className="text-muted mb-0">Completed Courses</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Main Content */}
      <Container style={{ padding: '3rem 0' }}>
        <Row>
          {/* Left Column - Course Progress */}
          <Col md={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-4">Course Progress</h4>
                {enrolledCourses.map(course => (
                  <div key={course.id} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">{course.title}</h6>
                      <span className="text-muted">{course.progress}%</span>
                    </div>
                    <ProgressBar
                      now={course.progress}
                      className="mb-3"
                      style={{ height: '8px', borderRadius: '4px' }}
                    />
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">Instructor: {course.instructor}</small>
                      <Button variant="outline-primary" size="sm">
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Upcoming Assessments */}
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h4 className="mb-4">Upcoming Assessments</h4>
                <ListGroup variant="flush">
                  {upcomingAssessments.map(assessment => (
                    <ListGroup.Item key={assessment.id} className="border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{assessment.title}</h6>
                          <small className="text-muted">
                            Course: {assessment.courseTitle} • Due: {assessment.dueDate}
                          </small>
                        </div>
                        <Button variant="primary" size="sm">
                          Start Assessment
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Performance & Recommendations */}
          <Col md={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-4">Performance Overview</h4>
                <div className="text-center mb-4">
                  <h2 className="text-primary mb-0">
                    {assessmentResults.length > 0
                      ? Math.round(
                          assessmentResults.reduce((acc, curr) => acc + (curr.score / curr.totalScore) * 100, 0) /
                            assessmentResults.length
                        )
                      : 0}%
                  </h2>
                  <p className="text-muted mb-0">Overall Performance</p>
                </div>
                <div className="mb-3">
                  <h6>Recent Results</h6>
                  {assessmentResults.slice(0, 3).map(result => (
                    <div key={result.id} className="d-flex justify-content-between align-items-center mb-2">
                      <small>{result.title}</small>
                      <span className="badge bg-primary">
                        {Math.round((result.score / result.totalScore) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h4 className="mb-4">Recommended Courses</h4>
                {recommendedCourses.map(course => (
                  <div key={course.id} className="mb-3">
                    <h6>{course.title}</h6>
                    <p className="text-muted small mb-2">{course.description}</p>
                    <Button variant="outline-primary" size="sm" className="w-100">
                      Enroll Now
                    </Button>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Features Section */}
      <div style={{ padding: '3rem 0', backgroundColor: '#f8f9fa' }}>
        <Container>
          <h2 className="text-center mb-5">Why Choose Our Platform?</h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="text-center">
                <FaUserGraduate className="text-primary mb-3" size={48} />
                <h4>Personalized Learning</h4>
                <p className="text-muted">
                  Get customized course recommendations based on your learning style and progress.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <FaLaptopCode className="text-primary mb-3" size={48} />
                <h4>Interactive Content</h4>
                <p className="text-muted">
                  Engage with interactive assessments and real-time feedback on your performance.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <FaCertificate className="text-primary mb-3" size={48} />
                <h4>Certification Ready</h4>
                <p className="text-muted">
                  Earn certificates as you complete courses and demonstrate your skills.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default StudentDashboard;
