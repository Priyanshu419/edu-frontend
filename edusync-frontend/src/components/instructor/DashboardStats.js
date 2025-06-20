import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const DashboardStats = ({ stats }) => {
  return (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="text-center">
            <h2 className="display-4">{stats.totalCourses}</h2>
            <p className="text-muted mb-0">Courses</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="text-center">
            <h2 className="display-4">{stats.totalStudents}</h2>
            <p className="text-muted mb-0">Students</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="text-center">
            <h2 className="display-4">{stats.totalAssessments}</h2>
            <p className="text-muted mb-0">Assessments</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="text-center">
            <h2 className="display-4">{stats.averageScore}%</h2>
            <p className="text-muted mb-0">Avg. Score</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStats;
