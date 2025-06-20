import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, uploadService } from '../utils/api';

const Profile = () => {
  const { currentUser, updateCurrentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profilePicture: ''
  });
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [previewImage, setPreviewImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  // Load user data on component mount
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Populate form with current user data
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        profilePicture: currentUser.profilePicture || ''
      });
      
      if (currentUser.profilePicture) {
        setPreviewImage(currentUser.profilePicture);
      }
    }
  }, [currentUser, isAuthenticated, navigate]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value
    });
  };
  
  // Handle profile picture selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const handleSelectImageClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      let profilePictureUrl = formData.profilePicture;
      
      // Upload new profile picture if selected
      if (imageFile) {
        try {
          // Use upload service to upload the profile picture
          const uploadResponse = await uploadService.uploadProfilePicture(imageFile);
          profilePictureUrl = uploadResponse.data.url;
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          setMessage({ 
            type: 'danger', 
            text: 'Failed to upload profile picture. Please try again.' 
          });
          setLoading(false);
          return;
        }
      }
      
      // Update user profile
      const updatedProfile = {
        ...formData,
        profilePicture: profilePictureUrl
      };
      
      const response = await userService.updateProfile(updatedProfile);
      
      // Update current user context
      updateCurrentUser({
        ...currentUser,
        ...response.data
      });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'danger', 
        text: 'Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordMessage({ type: '', text: '' });
    
    // Validate password
    if (password.new !== password.confirm) {
      setPasswordMessage({ 
        type: 'danger', 
        text: 'New password and confirmation do not match.' 
      });
      setLoading(false);
      return;
    }
    
    try {
      await userService.updatePassword({
        currentPassword: password.current,
        newPassword: password.new
      });
      
      // Reset password fields
      setPassword({
        current: '',
        new: '',
        confirm: ''
      });
      
      setPasswordMessage({ 
        type: 'success', 
        text: 'Password updated successfully!' 
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to update password. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">My Profile</h1>
      
      <Row>
        {/* Profile Information */}
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Profile Information</h5>
            </Card.Header>
            <Card.Body>
              {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                  {message.text}
                </Alert>
              )}
              
              <Form onSubmit={handleProfileUpdate}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled // Email cannot be changed
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </Form.Group>
                
                <div className="d-grid d-md-flex justify-content-md-end">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          {/* Password Update */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Change Password</h5>
            </Card.Header>
            <Card.Body>
              {passwordMessage.text && (
                <Alert variant={passwordMessage.type} dismissible onClose={() => setPasswordMessage({ type: '', text: '' })}>
                  {passwordMessage.text}
                </Alert>
              )}
              
              <Form onSubmit={handlePasswordUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="current"
                    value={password.current}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="new"
                        value={password.new}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                      <Form.Text className="text-muted">
                        Password must be at least 6 characters long.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirm"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-grid d-md-flex justify-content-md-end">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Profile Picture */}
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Profile Picture</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="profile-picture-container mb-3">
                {previewImage ? (
                  <Image 
                    src={previewImage} 
                    roundedCircle 
                    className="profile-picture"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="default-profile-picture rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '150px', height: '150px', backgroundColor: '#e9ecef', margin: '0 auto' }}
                  >
                    <i className="bi bi-person" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                  </div>
                )}
              </div>
              
              <Form.Group controlId="profilePicture" className="mb-3">
                <Form.Control 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageSelect} 
                  accept="image/*"
                  className="d-none"
                />
                <Button 
                  variant="outline-primary" 
                  onClick={handleSelectImageClick}
                  className="w-100"
                >
                  <i className="bi bi-camera me-2"></i>
                  Change Picture
                </Button>
              </Form.Group>
              
              {previewImage && imageFile && (
                <div className="mt-2 text-muted">
                  <small>Click "Update Profile" to save your new profile picture.</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
