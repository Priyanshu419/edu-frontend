import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Alert, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UsersList from '../components/user/UsersList';
import { userService } from '../utils/api';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // In a real implementation, you would fetch this from your API
    // For now, we'll use sample data
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would use:
        // const response = await api.get('/Users');
        // setUsers(response.data);
        
        // For demo purposes, we'll use sample data
        const sampleUsers = [
          {
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
          },
          {
            "userId": "072a581c-13eb-46cc-9a13-b2bf426379f6",
            "name": "Zoro",
            "email": "zoro@gmail.com",
            "role": "Instructor",
            "courses": [
              {
                "courseId": "a1e7a239-7660-47c5-9c1c-e4a4e7886e22",
                "title": "Azure",
                "description": "Azure Services",
                "instructorId": "072a581c-13eb-46cc-9a13-b2bf426379f6",
                "mediaUrl": "https://azure.microsoft.com/en-in/"
              }
            ],
            "enrollments": [],
            "results": []
          },
          {
            "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "name": "Sanji",
            "email": "sanji@gmail.com",
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
                "enrollmentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "courseId": "a1e7a239-7660-47c5-9c1c-e4a4e7886e22",
                "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
              }
            ],
            "results": [
              {
                "resultId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "assessmentId": "c92f6b4b-17ee-47e9-a16f-2620a0b63e6c",
                "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "score": 8,
                "attemptDate": "2025-05-20T14:21:32.817"
              }
            ]
          }
        ];
        
        setUsers(sampleUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Users</Breadcrumb.Item>
          </Breadcrumb>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Users</h2>
            <Link to="/users/new">
              <Button variant="primary">
                <i className="bi bi-plus-circle me-2"></i> Add User
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Form>
            <InputGroup>
              <Form.Control
                placeholder="Search users by name, email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading users...</p>
        </div>
      ) : (
        <UsersList users={filteredUsers} onViewUser={handleViewUser} />
      )}
    </Container>
  );
};

export default UsersListPage;
