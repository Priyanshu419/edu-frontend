import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import CourseCard from './CourseCard';

const CourseGrid = ({ courses, title }) => {
  return (
    <Container className="py-4">
      {title && <h2 className="mb-4">{title}</h2>}
      
      {courses && courses.length > 0 ? (
        <Row className="g-4">
          {courses.map(course => (
            <Col key={course.courseId} xs={12} md={6} lg={4}>
              <CourseCard course={course} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3">No courses available</p>
        </div>
      )}
    </Container>
  );
};

export default CourseGrid;
