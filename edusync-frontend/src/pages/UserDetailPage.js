import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Alert, Button } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import UserProfile from '../components/user/UserProfile';
import { userService } from '../utils/api';

const UserDetailPage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would use:
        // const response = await userService.getUserById(userId);
        // setUserData(response.data);
        
        // For demo purposes, we'll use sample data
        if (userId === '28f5bbaf-bdb5-4c8d-82c4-0138660673f4') {
          const sampleData = {
            "userId": "28f5bbaf-bdb5-4c8d-82c4-0138660673f4",
            "name": "luffy",
            "email": "luffy@gmail.com",
            "role": "Student",
            "courses": [
              {
                "courseId": "a1e7a239-7660-47c5-9c1c-e4a4e7886e22",
                "title": "Azure",
                "description": "Azure Services",
                "instructorId": "072a581c-13eb-46cc-9a13-b2bf426379f6",
                "mediaUrl": "https://azure.microsoft.com/en-in/"
              }
            ],
            "enrollments": [
              {
                "enrollmentId": "eb6f6974-c514-4dd9-84d6-2ee478593480",
                "courseId": "a1e7a239-7660-47c5-9c1c-e4a4e7886e22",
                "userId": "28f5bbaf-bdb5-4c8d-82c4-0138660673f4"
              },
              {
                "enrollmentId": "584dbd5b-bcd2-44e1-af96-f5e3addd19e5",
                "courseId": "a1e7a239-7660-47c5-9c1c-e4a4e7886e22",
                "userId": "28f5bbaf-bdb5-4c8d-82c4-0138660673f4"
              }
            ],
            "results": [
              {
                "resultId": "060b9977-e776-44cf-87fb-b4850638a0f8",
                "assessmentId": "c92f6b4b-17ee-47e9-a16f-2620a0b63e6c",
                "userId": "28f5bbaf-bdb5-4c8d-82c4-0138660673f4",
                "score": 10,
                "attemptDate": "2025-05-29T14:21:32.817"
              },
              {
                "resultId": "8820b11d-9540-446a-8d34-c14b2e101f02",
                "assessmentId": "7a051860-653f-4cf5-abbc-861925d06713",
                "userId": "28f5bbaf-bdb5-4c8d-82c4-0138660673f4",
                "score": 10,
                "attemptDate": "2025-05-31T03:58:37.4"
              }
            ]
          };
          setUserData(sampleData);
        } else {
          // If the userId doesn't match our sample, show an error
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setError('User ID is required');
      setLoading(false);
    }
  }, [userId]);

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/users' }}>Users</Breadcrumb.Item>
            <Breadcrumb.Item active>User Details</Breadcrumb.Item>
          </Breadcrumb>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">User Details</h2>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                onClick={() => navigate(`/users/${userId}/edit`)}
              >
                <i className="bi bi-pencil me-1"></i> Edit User
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/users')}
              >
                <i className="bi bi-arrow-left me-1"></i> Back to Users
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading user data...</p>
        </div>
      ) : (
        userData && <UserProfile userData={userData} />
      )}
    </Container>
  );
};

export default UserDetailPage;
