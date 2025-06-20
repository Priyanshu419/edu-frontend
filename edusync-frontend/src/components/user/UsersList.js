import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UsersList = ({ users, onViewUser }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-5 bg-light rounded">
        <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
        <p className="mt-3 mb-0">No users found</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Courses</th>
            <th>Assessments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td className="fw-medium">{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === 'Instructor' ? 'primary' : user.role === 'Admin' ? 'danger' : 'info'}>
                  {user.role}
                </Badge>
              </td>
              <td>{user.courses?.length || 0}</td>
              <td>{user.results?.length || 0}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => onViewUser(user.userId)}
                  >
                    <i className="bi bi-eye me-1"></i> View
                  </Button>
                  <Link to={`/users/${user.userId}/edit`}>
                    <Button variant="outline-secondary" size="sm">
                      <i className="bi bi-pencil me-1"></i> Edit
                    </Button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersList;
