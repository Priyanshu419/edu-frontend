import React from 'react';
import { Button, Table, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AssessmentsList = ({ assessments, courses, onCreateAssessment }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Assessments</h4>
        <Button variant="primary" onClick={onCreateAssessment}>
          <i className="bi bi-plus-circle me-2"></i> New Assessment
        </Button>
      </div>
      
      {assessments && assessments.length > 0 ? (
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Course</th>
                <th>Questions</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map(assessment => (
                <tr key={assessment.id}>
                  <td className="fw-medium">{assessment.title}</td>
                  <td>{assessment.courseTitle}</td>
                  <td>{assessment.questionCount || 0}</td>
                  <td>{assessment.createdAt}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/assessments/${assessment.id}/edit`}>
                        <Button variant="outline-primary" size="sm">
                          <i className="bi bi-pencil me-1"></i> Edit
                        </Button>
                      </Link>
                      <Link to={`/assessments/${assessment.id}/results`}>
                        <Button variant="outline-success" size="sm">
                          <i className="bi bi-graph-up me-1"></i> Results
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Card className="border-0 bg-light">
          <Card.Body className="text-center py-5">
            <i className="bi bi-clipboard text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="mt-3 mb-4">You haven't created any assessments yet</p>
            <Button variant="primary" onClick={onCreateAssessment}>
              <i className="bi bi-plus-circle me-2"></i> Create Your First Assessment
            </Button>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default AssessmentsList;
