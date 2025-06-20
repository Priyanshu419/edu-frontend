import React from 'react';
import { Card, Row, Col, Badge, Table, ListGroup } from 'react-bootstrap';

const UserProfile = ({ userData }) => {
  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="user-profile">
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3} className="text-center mb-3 mb-md-0">
              <div className="avatar-placeholder rounded-circle bg-primary bg-opacity-25 d-flex align-items-center justify-content-center mx-auto" style={{ width: '120px', height: '120px' }}>
                <span className="text-primary fw-bold fs-1">{userData.name?.charAt(0)}</span>
              </div>
            </Col>
            <Col md={9}>
              <h3 className="mb-1">{userData.name}</h3>
              <p className="text-muted mb-2">{userData.email}</p>
              <Badge bg="info" className="me-2">{userData.role}</Badge>
              <Badge bg="secondary">{userData.courses?.length || 0} Courses</Badge>
              
              <div className="mt-3">
                <h5>Overview</h5>
                <Row className="g-3 mt-1">
                  <Col sm={4}>
                    <Card className="bg-light border-0">
                      <Card.Body className="text-center py-3">
                        <h3 className="mb-1">{userData.courses?.length || 0}</h3>
                        <p className="text-muted mb-0">Enrolled Courses</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={4}>
                    <Card className="bg-light border-0">
                      <Card.Body className="text-center py-3">
                        <h3 className="mb-1">{userData.results?.length || 0}</h3>
                        <p className="text-muted mb-0">Assessments Taken</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={4}>
                    <Card className="bg-light border-0">
                      <Card.Body className="text-center py-3">
                        <h3 className="mb-1">
                          {userData.results?.length > 0 
                            ? Math.round(userData.results.reduce((sum, result) => sum + result.score, 0) / userData.results.length) 
                            : 0}
                        </h3>
                        <p className="text-muted mb-0">Avg. Score</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col lg={6} className="mb-4 mb-lg-0">
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Enrolled Courses</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {userData.courses && userData.courses.length > 0 ? (
                userData.courses.map((course, index) => (
                  <ListGroup.Item key={course.courseId || index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{course.title}</h6>
                      <small className="text-muted">{course.description}</small>
                    </div>
                    <Badge bg="primary" pill>
                      <i className="bi bi-book me-1"></i> View
                    </Badge>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center py-4">
                  <p className="text-muted mb-0">No courses enrolled</p>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Assessment Results</h5>
            </Card.Header>
            {userData.results && userData.results.length > 0 ? (
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Assessment ID</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.results.map((result, index) => (
                      <tr key={result.resultId || index}>
                        <td>{result.assessmentId}</td>
                        <td>
                          <Badge bg={result.score >= 7 ? "success" : result.score >= 5 ? "warning" : "danger"}>
                            {result.score}/10
                          </Badge>
                        </td>
                        <td>{new Date(result.attemptDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Card.Body className="text-center py-4">
                <p className="text-muted mb-0">No assessment results available</p>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
