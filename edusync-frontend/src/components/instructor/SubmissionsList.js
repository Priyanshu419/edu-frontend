import React from 'react';
import { Table, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SubmissionsList = ({ submissions }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Student Submissions</h4>
      </div>
      
      {submissions && submissions.length > 0 ? (
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Assessment</th>
                <th>Course</th>
                <th>Score</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(submission => (
                <tr key={submission.id}>
                  <td>{submission.studentName}</td>
                  <td>{submission.assessmentTitle}</td>
                  <td>{submission.courseTitle}</td>
                  <td>
                    <Badge bg={submission.score >= 70 ? 'success' : submission.score >= 50 ? 'warning' : 'danger'} pill>
                      {submission.score}%
                    </Badge>
                  </td>
                  <td>{submission.submittedDate}</td>
                  <td>
                    <Link to={`/assessments/${submission.id}/results`}>
                      <Button variant="outline-primary" size="sm">
                        <i className="bi bi-eye me-1"></i> View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Card className="border-0 bg-light">
          <Card.Body className="text-center py-5">
            <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="mt-3">No student submissions yet</p>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default SubmissionsList;
