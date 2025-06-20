import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../utils/api';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Login validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login, isAuthenticated, isStudent, isInstructor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      // Redirect based on user role
      if (isStudent()) {
        navigate('/student-dashboard');
      } else if (isInstructor()) {
        navigate('/instructor-dashboard');
      }
    }
  }, [isAuthenticated, isStudent, isInstructor, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    setLoading(true);
    
    try {
      const response = await authService.login(values);
      const userRole = login(response.data.token, response.data.user);
      
      // Redirect based on user role
      if (userRole === 'Instructor') {
        navigate('/instructor-dashboard');
      } else if (userRole === 'Student') {
        navigate('/student-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  
  // For demo purposes - quick login as instructor or student
  const handleQuickLogin = (role) => {
    setLoading(true);
    setTimeout(() => {
      // Create a mock token with the format: mock_token_[id]_[role]_[timestamp]
      const mockToken = `mock_token_${role === 'Instructor' ? '101' : '202'}_${role}_${Date.now()}`;
      
      // Mock user data
      const mockUser = {
        id: role === 'Instructor' ? 101 : 202,
        name: role === 'Instructor' ? 'Jane Smith' : 'John Doe',
        email: role === 'Instructor' ? 'instructor@example.com' : 'student@example.com',
        role: role
      };
      
      login(mockToken, mockUser);
      navigate(role === 'Instructor' ? '/instructor-dashboard' : '/student-dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Please login to your account</p>
              </div>

              {successMessage && (
                <Alert variant="success" className="mb-4">
                  {successMessage}
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-envelope"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your email"
                          isInvalid={touched.email && errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your password"
                          isInvalid={touched.password && errors.password}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        className="rounded-pill"
                        disabled={loading || isSubmitting}
                      >
                        {loading || isSubmitting ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Logging in...
                          </>
                        ) : (
                          'Login'
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary">
                    Register here
                  </Link>
                </p>
              </div>

              <div className="mt-4">
                <div className="d-flex align-items-center mb-3">
                  <hr className="flex-grow-1" />
                  <span className="mx-3 text-muted">or</span>
                  <hr className="flex-grow-1" />
                </div>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleQuickLogin('Student')}
                    disabled={loading}
                  >
                    <i className="bi bi-person me-2"></i>
                    Quick Login as Student
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleQuickLogin('Instructor')}
                    disabled={loading}
                  >
                    <i className="bi bi-person-badge me-2"></i>
                    Quick Login as Instructor
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
