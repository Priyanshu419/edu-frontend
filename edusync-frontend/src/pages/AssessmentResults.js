import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert, Button, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService, courseService } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const AssessmentResults = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isInstructor } = useAuth();
  
  const [assessment, setAssessment] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Analytics
  const [analytics, setAnalytics] = useState({
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    passRate: 0,
    scoreDistribution: {
      '90-100': 0,
      '80-89': 0,
      '70-79': 0,
      '60-69': 0,
      'Below 60': 0
    },
    questionAnalysis: []
  });
  
  useEffect(() => {
    // Redirect if not authenticated or not an instructor
    if (!isAuthenticated() || !isInstructor()) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch assessment details
        const assessmentResponse = await assessmentService.getAssessmentById(assessmentId);
        setAssessment(assessmentResponse.data);
        
        // Fetch assessment results
        const resultsResponse = await assessmentService.getAssessmentResults(assessmentId);
        setResults(resultsResponse.data);
        
        // Calculate analytics if results exist
        if (resultsResponse.data.length > 0) {
          calculateAnalytics(assessmentResponse.data, resultsResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load assessment results. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [assessmentId, navigate, isAuthenticated, isInstructor]);
  
  // Calculate analytics from assessment results
  const calculateAnalytics = (assessmentData, resultsData) => {
    if (!resultsData.length) return;
    
    // Calculate basic statistics
    const scores = resultsData.map(result => result.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    
    // Calculate pass rate (score >= 70)
    const passCount = scores.filter(score => score >= 70).length;
    const passRate = (passCount / scores.length) * 100;
    
    // Calculate score distribution
    const scoreDistribution = {
      '90-100': scores.filter(score => score >= 90 && score <= 100).length,
      '80-89': scores.filter(score => score >= 80 && score < 90).length,
      '70-79': scores.filter(score => score >= 70 && score < 80).length,
      '60-69': scores.filter(score => score >= 60 && score < 70).length,
      'Below 60': scores.filter(score => score < 60).length
    };
    
    // Question analysis would require detailed data about which questions were answered correctly
    // This is a simplified version since we don't have that data in the mock API
    const questionAnalysis = assessmentData.questions?.map((question, index) => ({
      questionNumber: index + 1,
      questionText: question.text,
      correctAnswers: Math.floor(Math.random() * resultsData.length), // Mock data
      totalAttempts: resultsData.length,
      successRate: Math.floor(Math.random() * 100) // Mock data
    })) || [];
    
    setAnalytics({
      averageScore,
      highestScore,
      lowestScore,
      passRate,
      scoreDistribution,
      questionAnalysis
    });
  };
  
  // Sort results
  const sortResults = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking on the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new field
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const getSortedResults = () => {
    if (!results.length) return [];
    
    return [...results].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'score') {
        comparison = a.score - b.score;
      } else if (sortField === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortField === 'name') {
        comparison = a.studentName.localeCompare(b.studentName);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };
  
  // Chart data for score distribution
  const scoreDistributionData = {
    labels: Object.keys(analytics.scoreDistribution),
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(analytics.scoreDistribution),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Chart data for question analysis
  const questionAnalysisData = {
    labels: analytics.questionAnalysis.map(q => `Q${q.questionNumber}`),
    datasets: [
      {
        label: 'Success Rate (%)',
        data: analytics.questionAnalysis.map(q => q.successRate),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };
  
  const exportToCsv = () => {
    if (!results.length) return;
    
    // Create CSV content
    const headers = ['Student Name', 'Score', 'Date', 'Correct Answers', 'Total Questions'];
    const csvContent = [
      headers.join(','),
      ...getSortedResults().map(result => [
        result.studentName || 'Student',
        result.score,
        result.date,
        result.correctAnswers,
        result.totalQuestions
      ].join(','))
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${assessment.title}_results.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading assessment results...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{assessment?.title} Results</h2>
          <p className="text-muted">View student performance data for this assessment</p>
        </div>
        <div>
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={() => navigate(`/courses/${assessment?.courseId}/assessments`)}
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Assessments
          </Button>
          <Button 
            variant="primary" 
            onClick={exportToCsv}
            disabled={!results.length}
          >
            <i className="bi bi-download me-1"></i> Export to CSV
          </Button>
        </div>
      </div>
      
      {results.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <i className="bi bi-clipboard-data display-1 text-muted"></i>
            <h4 className="mt-3">No Results Available</h4>
            <p className="text-muted">No students have completed this assessment yet.</p>
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Analytics Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h6 className="text-muted">Average Score</h6>
                  <h2>{analytics.averageScore.toFixed(1)}%</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h6 className="text-muted">Highest Score</h6>
                  <h2>{analytics.highestScore}%</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h6 className="text-muted">Pass Rate</h6>
                  <h2>{analytics.passRate.toFixed(1)}%</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h6 className="text-muted">Completions</h6>
                  <h2>{results.length}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Charts */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="h-100">
                <Card.Header>Score Distribution</Card.Header>
                <Card.Body style={{ height: '300px' }}>
                  <Pie data={scoreDistributionData} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Header>Question Analysis</Card.Header>
                <Card.Body style={{ height: '300px' }}>
                  <Bar data={questionAnalysisData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Results Table */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Student Results</h5>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
                  Sort By: {sortField.charAt(0).toUpperCase() + sortField.slice(1)} ({sortDirection === 'asc' ? 'Ascending' : 'Descending'})
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => sortResults('date')}>Date</Dropdown.Item>
                  <Dropdown.Item onClick={() => sortResults('name')}>Student Name</Dropdown.Item>
                  <Dropdown.Item onClick={() => sortResults('score')}>Score</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Score</th>
                    <th>Result</th>
                    <th>Date</th>
                    <th>Correct Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedResults().map((result, index) => (
                    <tr key={index}>
                      <td>{result.studentName || `Student ${result.studentId}`}</td>
                      <td>{result.score}%</td>
                      <td>
                        {result.score >= 70 ? (
                          <Badge bg="success">Pass</Badge>
                        ) : (
                          <Badge bg="danger">Fail</Badge>
                        )}
                      </td>
                      <td>{result.date}</td>
                      <td>{result.correctAnswers} / {result.totalQuestions}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default AssessmentResults;
