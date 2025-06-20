import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Alert, Badge, ListGroup } from 'react-bootstrap';
import { courseService } from '../../utils/api';

const CourseEnrollmentManager = ({ courseId, courseName }) => {
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  
  // Fetch enrolled and available students when component mounts or courseId changes
  useEffect(() => {
    if (!courseId) return;
    
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // Fetch students enrolled in this course
        const enrolledResponse = await courseService.getEnrolledStudents(courseId);
        setEnrolledStudents(enrolledResponse.data);
        
        // Fetch students not yet enrolled in this course
        const availableResponse = await courseService.getAvailableStudents(courseId);
        setAvailableStudents(availableResponse.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setAlert({
          show: true,
          variant: 'danger',
          message: 'Failed to load student data. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [courseId]);
  
  // Handle assigning a student to the course
  const handleAssignStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      const response = await courseService.assignCourse(courseId, selectedStudent.id);
      
      // Update state to reflect the change
      const updatedStudent = {
        ...selectedStudent,
        enrollmentDate: new Date().toISOString().split('T')[0],
        progress: 0
      };
      
      setEnrolledStudents([...enrolledStudents, updatedStudent]);
      setAvailableStudents(availableStudents.filter(s => s.id !== selectedStudent.id));
      
      setAlert({
        show: true,
        variant: 'success',
        message: response.data.message || 'Student has been successfully enrolled.'
      });
      
      // Close the modal
      setShowAssignModal(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error assigning student:', error);
      setAlert({
        show: true,
        variant: 'danger',
        message: error.response?.data?.message || 'Failed to assign student to the course.'
      });
    }
  };
  
  // State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  
  // Handle initiating student removal (shows confirmation modal)
  const initiateRemoveStudent = (student) => {
    setStudentToRemove(student);
    setShowConfirmModal(true);
  };
  
  // Handle removing a student from the course after confirmation
  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;
    
    try {
      const response = await courseService.removeStudentFromCourse(courseId, studentToRemove.id);
      
      // Update state to reflect the change
      setEnrolledStudents(enrolledStudents.filter(s => s.id !== studentToRemove.id));
      setAvailableStudents([...availableStudents, { 
        id: studentToRemove.id, 
        name: studentToRemove.name, 
        email: studentToRemove.email 
      }]);
      
      setAlert({
        show: true,
        variant: 'success',
        message: response.data.message || 'Student has been successfully removed from the course.'
      });
      
      // Close the confirmation modal and reset state
      setShowConfirmModal(false);
      setStudentToRemove(null);
    } catch (error) {
      console.error('Error removing student:', error);
      setAlert({
        show: true,
        variant: 'danger',
        message: error.response?.data?.message || 'Failed to remove student from the course.'
      });
      
      // Close the confirmation modal
      setShowConfirmModal(false);
      setStudentToRemove(null);
    }
  };
  
  return (
    <div className="mb-4">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Course Enrollment Management</h5>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAssignModal(true)}
            disabled={availableStudents.length === 0}
          >
            <i className="bi bi-person-plus me-1"></i> Assign Students
          </Button>
        </Card.Header>
        <Card.Body>
          {alert.show && (
            <Alert 
              variant={alert.variant} 
              onClose={() => setAlert({ ...alert, show: false })} 
              dismissible
            >
              {alert.message}
            </Alert>
          )}
          
          <h6 className="mb-3">
            Students enrolled in <strong>{courseName}</strong>
          </h6>
          
          {loading ? (
            <div className="text-center my-4">
              <p>Loading student data...</p>
            </div>
          ) : enrolledStudents.length === 0 ? (
            <div className="text-center my-4">
              <p>No students are currently enrolled in this course.</p>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setShowAssignModal(true)}
                disabled={availableStudents.length === 0}
              >
                Assign Students
              </Button>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Enrollment Date</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.enrollmentDate}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${student.progress}%` }}
                            aria-valuenow={student.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <span className="text-muted small">{student.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => initiateRemoveStudent(student)}
                      >
                        <i className="bi bi-person-dash"></i> Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      {/* Assign Student Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Students to Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {availableStudents.length === 0 ? (
            <Alert variant="info">
              There are no more students available to assign to this course.
            </Alert>
          ) : (
            <>
              <p>Select a student to assign to <strong>{courseName}</strong>:</p>
              
              <ListGroup className="mb-3">
                {availableStudents.map(student => (
                  <ListGroup.Item 
                    key={student.id} 
                    action
                    active={selectedStudent?.id === student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div>{student.name}</div>
                      <small className="text-muted">{student.email}</small>
                    </div>
                    {selectedStudent?.id === student.id && (
                      <Badge bg="primary">Selected</Badge>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssignStudent}
            disabled={!selectedStudent || availableStudents.length === 0}
          >
            Assign Student
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Confirmation Modal for removing students */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {studentToRemove && (
            <>
              <p>Are you sure you want to remove <strong>{studentToRemove.name}</strong> from this course?</p>
              <p className="text-muted small">This action will remove the student's access to all course materials and assessments.</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRemoveStudent}>
            Remove Student
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseEnrollmentManager;
