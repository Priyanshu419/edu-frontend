import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserProfile from '../components/user/UserProfile';
import { userService } from '../utils/api';

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // For demonstration purposes, we can also use the sample data
  const useSampleData = () => {
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
    setLoading(false);
    setError(null);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>My Profile</Breadcrumb.Item>
          </Breadcrumb>
          <h2 className="mb-0">My Profile</h2>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
          <div className="mt-2">
            <button 
              className="btn btn-sm btn-outline-danger" 
              onClick={useSampleData}
            >
              Load Sample Data
            </button>
          </div>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading profile data...</p>
        </div>
      ) : (
        <UserProfile userData={userData} />
      )}
    </Container>
  );
};

export default UserProfilePage;
