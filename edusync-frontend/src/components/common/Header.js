import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown, Image, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, isInstructor, isStudent, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Add scroll effect for transparent to solid navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      bg={isScrolled || location.pathname !== '/' ? "primary" : "transparent"} 
      variant="dark" 
      expand="lg" 
      className={`${location.pathname === '/' && !isScrolled ? 'position-absolute w-100 top-0 z-3' : 'mb-4'} transition-all`}
      fixed={location.pathname === '/' && !isScrolled ? "top" : ""}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-book me-2"></i>
          EduSync
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Nav.Link>
            <Nav.Link as={Link} to="/courses" className={location.pathname === '/courses' ? 'active' : ''}>Courses</Nav.Link>
            
            {isAuthenticated() && (
              <NavDropdown title="Learning" id="learning-dropdown">
                {isStudent() && (
                  <>
                    <NavDropdown.Item as={Link} to="/student-dashboard">
                      <i className="bi bi-mortarboard me-2"></i>My Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/courses">
                      <i className="bi bi-collection me-2"></i>Browse Courses
                    </NavDropdown.Item>
                  </>
                )}
                {isInstructor() && (
                  <>
                    <NavDropdown.Item as={Link} to="/instructor-dashboard">
                      <i className="bi bi-speedometer2 me-2"></i>Instructor Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/courses">
                      <i className="bi bi-collection me-2"></i>All Courses
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/assessments">
                  <i className="bi bi-check2-square me-2"></i>Assessments
                  {isStudent() && (
                    <Badge bg="accent" pill className="ms-2">New</Badge>
                  )}
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated() ? (
              <>
                <NavDropdown 
                  title={
                    <span>
                      {currentUser.profilePicture ? (
                        <Image 
                          src={currentUser.profilePicture} 
                          roundedCircle 
                          width="30" 
                          height="30" 
                          className="me-2 object-fit-cover border" 
                          alt={currentUser.name}
                        />
                      ) : (
                        <i className="bi bi-person-circle me-2"></i>
                      )}
                      {currentUser.name}
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i>My Profile
                  </NavDropdown.Item>
                  {isInstructor() && (
                    <NavDropdown.Item as={Link} to="/instructor-dashboard">
                      <i className="bi bi-speedometer2 me-2"></i>Instructor Dashboard
                    </NavDropdown.Item>
                  )}
                  {isStudent() && (
                    <NavDropdown.Item as={Link} to="/student-dashboard">
                      <i className="bi bi-mortarboard me-2"></i>Student Dashboard
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <Button variant="outline-light" className="me-2">Login</Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <Button variant="light">Register</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
