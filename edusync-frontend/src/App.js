import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseManagement from './pages/CourseManagement';
import Assessment from './pages/Assessment';
import Assessments from './pages/Assessments';
import AssessmentResults from './pages/AssessmentResults';
import Profile from './pages/Profile';
import UserProfilePage from './pages/UserProfilePage';
import UsersListPage from './pages/UsersListPage';
import UserDetailPage from './pages/UserDetailPage';
import CourseAssessmentsPage from './pages/CourseAssessmentsPage'; // Added for course-specific assessments

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Icons CSS
import 'bootstrap-icons/font/bootstrap-icons.css';
// Custom Orange Theme
import './styles/OrangeTheme.css';

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isInstructor, isStudent, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole === 'Instructor' && !isInstructor()) {
    return <Navigate to="/" />;
  }
  
  if (requiredRole === 'Student' && !isStudent()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseDetail />} />
              <Route 
                path="/student-dashboard" 
                element={
                  <ProtectedRoute requiredRole="Student">
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/instructor-dashboard" 
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <InstructorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/courses/:courseId/manage" 
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <CourseManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/courses/:courseId/take-assessment" 
                element={
                  <ProtectedRoute requiredRole="Student">
                    <CourseAssessmentsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessments/:assessmentId" 
                element={
                  <ProtectedRoute requiredRole="Student">
                    <Assessment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/courses/:courseId/assessments" 
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <Assessments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessments/:assessmentId/results" 
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <AssessmentResults />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessments" 
                element={
                  <ProtectedRoute>
                    {/* This will just render the appropriate dashboard */}
                    <InstructorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-profile" 
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <UsersListPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users/:userId" 
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <UserDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
