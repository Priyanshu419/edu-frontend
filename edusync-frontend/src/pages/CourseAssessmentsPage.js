import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { assessmentService, courseService } from '../utils/api';

const CourseAssessmentsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const courseRes = await courseService.getCourseById(courseId);
        setCourse(courseRes.data);

        const assessmentsRes = await assessmentService.getAssessments();
        // Filter assessments by courseId client-side
        // This assumes assessments have a 'courseId' or similar property.
        // If not, the backend API /Assessments might need a query param for courseId
        const courseAssessments = assessmentsRes.data.filter(asm => asm.courseId && asm.courseId.toLowerCase() === courseId.toLowerCase());
        setAssessments(courseAssessments);

      } catch (err) {
        console.error('Error fetching course assessments:', err);
        setError('Failed to load assessments for this course. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading assessments...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {course && <h2 className="mb-4">Assessments for: {course.title}</h2>}
      {!course && <h2 className="mb-4">Assessments</h2>}

      {assessments.length === 0 ? (
        <Alert variant="info">No assessments found for this course.</Alert>
      ) : (
        <ListGroup>
          {assessments.map(assessment => (
            <ListGroup.Item key={assessment.id} className="d-flex justify-content-between align-items-center">
              <div>
                <h5>{assessment.title}</h5>
                <p className="mb-1 text-muted">{assessment.description || 'No description available.'}</p>
              </div>
              <Link to={`/assessments/${assessment.id}`}>
                <Button variant="primary">Start Assessment</Button>
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <Button variant="secondary" as={Link} to="/student-dashboard" className="mt-4">
        Back to Dashboard
      </Button>
    </Container>
  );
};

export default CourseAssessmentsPage;
