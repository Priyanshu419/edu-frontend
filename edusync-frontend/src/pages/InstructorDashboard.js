import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { courseService, assessmentService } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Import sub-components
import DashboardStats from '../components/instructor/DashboardStats';
import CoursesList from '../components/instructor/CoursesList';
import CourseGrid from '../components/CourseGrid';
import AssessmentsList from '../components/instructor/AssessmentsList';
import SubmissionsList from '../components/instructor/SubmissionsList';
import CreateCourseModal from '../components/instructor/CreateCourseModal';
import CreateAssessmentModal from '../components/instructor/CreateAssessmentModal';

const InstructorDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  
  // Data state
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // All courses for dropdown
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalAssessments: 0,
    averageScore: 0
  });
  
  // Fetch data
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses created by this instructor
      const coursesResponse = await courseService.getInstructorCourses();
      let coursesData = coursesResponse.data;
      
      // Enhance course data with additional information if needed
      setCourses(coursesData);
      
      // Fetch all courses for assessment dropdown
      try {
        const allCoursesResponse = await courseService.getAllCourses();
        console.log('All courses fetched:', allCoursesResponse.data);
        setAllCourses(allCoursesResponse.data);
      } catch (error) {
        console.error('Error fetching all courses:', error);
        toast.error('Failed to load all courses for assessment creation.');
      }
      
      // Fetch assessments
      const assessmentsResponse = await assessmentService.getAssessments();
      // Filter assessments for courses taught by this instructor
      const instructorCourseIds = coursesData.map(course => course.courseId);
      const assessmentsData = assessmentsResponse.data.filter(assessment => 
        instructorCourseIds.includes(assessment.courseId)
      );
      setAssessments(assessmentsData);
      
      // Fetch assessment results
      // In a real implementation, you would fetch actual submissions
      // For now, we'll use placeholder data until the backend is ready
      const submissionsData = [];
      for (const assessment of assessmentsData.slice(0, 3)) { // Limit to first 3 assessments for demo
        try {
          const resultsResponse = await assessmentService.getAssessmentResults(assessment.assessmentId);
          if (resultsResponse.data && resultsResponse.data.length > 0) {
            submissionsData.push(...resultsResponse.data);
          }
        } catch (err) {
          console.error(`Error fetching results for assessment ${assessment.assessmentId}:`, err);
        }
      }
      
      // If no real submissions yet, use placeholder data
      if (submissionsData.length === 0) {
        const placeholderSubmissions = [
          { id: 1, studentName: 'Student 1', assessmentTitle: 'Assessment 1', courseTitle: coursesData[0]?.title || 'Course', score: 85, submittedDate: new Date().toISOString().split('T')[0] },
          { id: 2, studentName: 'Student 2', assessmentTitle: 'Assessment 1', courseTitle: coursesData[0]?.title || 'Course', score: 72, submittedDate: new Date().toISOString().split('T')[0] },
        ];
        setSubmissions(placeholderSubmissions);
      } else {
        setSubmissions(submissionsData);
      }
      
      // Calculate stats
      // Get total students by counting unique enrollments across all courses
      let totalStudents = 0;
      for (const course of coursesData) {
        try {
          const enrolledStudents = await courseService.getEnrolledStudents(course.courseId);
          totalStudents += enrolledStudents.data.length;
        } catch (err) {
          console.error(`Error fetching enrolled students for course ${course.courseId}:`, err);
        }
      }
      
      const totalAssessments = assessmentsData.length;
      const averageScore = submissionsData.length > 0 
        ? submissionsData.reduce((sum, sub) => sum + sub.score, 0) / submissionsData.length 
        : 0;
      
      setStats({
        totalCourses: coursesData.length,
        totalStudents,
        totalAssessments,
        averageScore: Math.round(averageScore)
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };
  
  // Handle course creation
  const handleCreateCourse = async (courseData) => {
    try {
      // Add the current user as the instructor
      const courseToCreate = {
        ...courseData,
        instructorId: currentUser.id
      };
      
      // Create the course
      const response = await courseService.createCourse(courseToCreate);
      
      // Show success message
      toast.success('Course created successfully!');
      
      // Close the modal
      setShowCourseModal(false);
      
      // Refresh dashboard data
      fetchDashboardData();
      
      // Navigate to course management page
      navigate(`/courses/manage/${response.data.courseId}`);
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    }
  };
  
  // Handle assessment creation
  const handleCreateAssessment = async (assessmentData) => {
    try {
      // Create the assessment
      const response = await assessmentService.createAssessment(assessmentData);
      
      // Show success message
      toast.success('Assessment created successfully!');
      
      // Close the modal
      setShowAssessmentModal(false);
      
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast.error('Failed to create assessment. Please try again.');
    }
  };
  
  return (
    <Container fluid className="py-4 px-4 px-md-5">
      {/* Dashboard Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Instructor Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, {currentUser?.name || 'Instructor'}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => setShowAssessmentModal(true)}>
            <i className="bi bi-clipboard-plus me-2"></i> New Assessment
          </Button>
          <Button variant="primary" onClick={() => setShowCourseModal(true)}>
            <i className="bi bi-plus-circle me-2"></i> New Course
          </Button>
        </div>
      </div>
      
      {/* Dashboard Stats */}
      <DashboardStats stats={stats} />
      
      {/* Main Content */}
      <Tab.Container id="dashboard-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          {/* Sidebar Navigation */}
          <Col md={3} lg={2} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="dashboard" className="rounded-0 border-0 ps-4 py-3">
                      <i className="bi bi-speedometer2 me-2"></i> Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="courses" className="rounded-0 border-0 ps-4 py-3">
                      <i className="bi bi-book me-2"></i> My Courses
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="assessments" className="rounded-0 border-0 ps-4 py-3">
                      <i className="bi bi-check-square me-2"></i> Assessments
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="submissions" className="rounded-0 border-0 ps-4 py-3">
                      <i className="bi bi-file-earmark-text me-2"></i> Submissions
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="analytics" className="rounded-0 border-0 ps-4 py-3">
                      <i className="bi bi-bar-chart me-2"></i> Analytics
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Main Content Area */}
          <Col md={9} lg={10}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading dashboard data...</p>
                  </div>
                ) : (
                  <Tab.Content>
                    {/* Dashboard Overview */}
                    <Tab.Pane eventKey="dashboard">
                      <h4 className="mb-4">Dashboard Overview</h4>
                      {/* Featured courses section */}
                      <div className="mb-5">
                        <h5 className="mb-3">Featured Courses</h5>
                        <CourseGrid 
                          courses={courses.slice(0, 3)} 
                        />
                      </div>
                      {/* Recent assessments and submissions */}
                    </Tab.Pane>
                    
                    {/* Courses Tab */}
                    <Tab.Pane eventKey="courses">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0">My Courses</h4>
                        <Button variant="primary" onClick={() => setShowCourseModal(true)}>
                          <i className="bi bi-plus-circle me-2"></i> New Course
                        </Button>
                      </div>
                      {/* Modern course grid display */}
                      <CourseGrid courses={courses} />
                      
                      {/* Original list view (commented out) */}
                      {/* <CoursesList 
                        courses={courses} 
                        onCreateCourse={() => setShowCourseModal(true)} 
                      /> */}
                    </Tab.Pane>
                    
                    {/* Assessments Tab */}
                    <Tab.Pane eventKey="assessments">
                      <AssessmentsList 
                        assessments={assessments} 
                        courses={courses}
                        onCreateAssessment={() => setShowAssessmentModal(true)} 
                      />
                    </Tab.Pane>
                    
                    {/* Submissions Tab */}
                    <Tab.Pane eventKey="submissions">
                      <SubmissionsList submissions={submissions} />
                    </Tab.Pane>
                    
                    {/* Analytics Tab */}
                    <Tab.Pane eventKey="analytics">
                      <h4 className="mb-4">Analytics & Insights</h4>
                      <div className="text-center py-5">
                        <i className="bi bi-bar-chart" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-3">Analytics dashboard coming soon.</p>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
      
      {/* Modals */}
      <CreateCourseModal 
        show={showCourseModal}
        onHide={() => setShowCourseModal(false)}
        onCreateCourse={handleCreateCourse}
      />
      
      <CreateAssessmentModal
        show={showAssessmentModal}
        onHide={() => setShowAssessmentModal(false)}
        courses={allCourses.length > 0 ? allCourses : courses} // Use all courses if available
        onCreateAssessment={handleCreateAssessment}
      />
    </Container>
  );
};

export default InstructorDashboard;