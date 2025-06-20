import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // For mock tokens: mock_token_id_role_timestamp
        if (token.startsWith('mock_token_')) {
          const parts = token.split('_');
          const id = parseInt(parts[2]);
          const role = parts[3];
          
          setCurrentUser({
            id,
            role,
            // Additional info needed for the UI
            name: role === 'Student' ? 'John Doe' : 'Jane Smith',
            email: role === 'Student' ? 'student@example.com' : 'instructor@example.com'
          });
        } else {
          // For real JWT tokens from the backend
          try {
            const decodedToken = jwtDecode(token);
            setCurrentUser({
              id: decodedToken.sub, // UserId is in the 'sub' claim
              name: decodedToken.name,
              email: decodedToken.email,
              role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role
            });
          } catch (error) {
            console.error('Error decoding JWT token:', error);
            localStorage.removeItem('token');
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error('Error processing token:', error);
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData = null) => {
    localStorage.setItem('token', token);
    
    // Handle mock tokens
    if (token.startsWith('mock_token_')) {
      const parts = token.split('_');
      const id = parseInt(parts[2]);
      const role = parts[3];
      
      const user = {
        id,
        role,
        name: userData?.name || (role === 'Student' ? 'John Doe' : 'Jane Smith'),
        email: userData?.email || (role === 'Student' ? 'student@example.com' : 'instructor@example.com')
      };
      
      setCurrentUser(user);
      return user.role;
    } else {
      // For real JWT tokens from the backend
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role;
        
        // Use userData from the login response or fall back to decoded token data
        const user = {
          id: userData?.id || decodedToken.sub,
          name: userData?.name || decodedToken.name,
          email: userData?.email || decodedToken.email,
          role: userData?.role || role
        };
        
        setCurrentUser(user);
        return user.role;
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return 'Student'; // Default fallback
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return !!currentUser;
  };

  const isInstructor = () => {
    return currentUser?.role === 'Instructor';
  };

  const isStudent = () => {
    return currentUser?.role === 'Student';
  };

  // Function to update current user data (for profile updates)
  const updateCurrentUser = (userData) => {
    if (!currentUser) return;
    
    // Update the current user with new data
    setCurrentUser({
      ...currentUser,
      ...userData
    });
    
    // If we're using mock tokens, also update the user ID in localStorage
    // This helps keep the mock data consistent between page refreshes
    const token = localStorage.getItem('token');
    if (token && token.startsWith('mock_token_')) {
      localStorage.setItem('userId', userData.id || currentUser.id);
    }
    
    console.log('User profile updated:', {
      ...currentUser,
      ...userData
    });
  };
  
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    isInstructor,
    isStudent,
    loading,
    updateCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
