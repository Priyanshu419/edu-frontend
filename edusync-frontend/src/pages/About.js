import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <h1 className="text-center mb-4">About EduSync</h1>
          <p className="lead text-center mb-5">
            A comprehensive learning management system built for the digital education era.
          </p>
          
          <Card className="shadow-sm mb-5">
            <Card.Body className="p-5">
              <h2 className="mb-4">Our Mission</h2>
              <p>
                At EduSync, we're dedicated to transforming the educational experience through technology. 
                Our platform provides a seamless environment for learning, teaching, and assessment, 
                enabling institutions and instructors to deliver high-quality education in a digital format.
              </p>
              <p>
                We believe that education should be accessible, engaging, and effective. Our tools are 
                designed to support these principles, helping instructors create compelling content and 
                enabling students to take control of their learning journey.
              </p>
              
              <h2 className="mt-5 mb-4">Key Features</h2>
              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <h4><i className="bi bi-book text-primary me-2"></i> Course Management</h4>
                    <p>Create, organize, and deliver course content with ease.</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <h4><i className="bi bi-clipboard-check text-primary me-2"></i> Assessment Tools</h4>
                    <p>Build quizzes and assessments with automated grading.</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <h4><i className="bi bi-graph-up text-primary me-2"></i> Performance Analytics</h4>
                    <p>Track student progress and identify areas for improvement.</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <h4><i className="bi bi-cloud-upload text-primary me-2"></i> Cloud Integration</h4>
                    <p>Seamlessly store and deliver content through Azure services.</p>
                  </div>
                </Col>
              </Row>
              
              <h2 className="mt-5 mb-4">Technology Stack</h2>
              <p>
                EduSync is built with modern technologies to ensure reliability, scalability, and security:
              </p>
              <ul>
                <li><strong>Frontend:</strong> React.js, Bootstrap</li>
                <li><strong>Backend:</strong> ASP.NET Core API</li>
                <li><strong>Database:</strong> Azure SQL</li>
                <li><strong>Storage:</strong> Azure Blob Storage</li>
                <li><strong>Analytics:</strong> Azure Event Hubs, Stream Analytics</li>
                <li><strong>DevOps:</strong> Azure DevOps, CI/CD Pipeline</li>
              </ul>
              
              <h2 className="mt-5 mb-4">Our Team</h2>
              <p>
                EduSync was developed by a dedicated team of full-stack developers, cloud engineers, and 
                UX designers with a passion for education technology. Our team members bring diverse 
                expertise in web development, cloud architecture, and educational psychology to create 
                a platform that truly meets the needs of modern educational institutions.
              </p>
            </Card.Body>
          </Card>
          
          <div className="text-center">
            <h3 className="mb-4">Connect With Us</h3>
            <div className="d-flex justify-content-center">
              <button className="btn btn-link mx-3 text-decoration-none" aria-label="Email us">
                <i className="bi bi-envelope fs-3 text-primary"></i>
              </button>
              <button className="btn btn-link mx-3 text-decoration-none" aria-label="Visit our GitHub">
                <i className="bi bi-github fs-3 text-primary"></i>
              </button>
              <button className="btn btn-link mx-3 text-decoration-none" aria-label="Visit our LinkedIn">
                <i className="bi bi-linkedin fs-3 text-primary"></i>
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
