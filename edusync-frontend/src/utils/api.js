// utils/api.js
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://localhost:7032/api',
  headers: {
    'Content-Type': 'application/json', // Primarily for POST/PUT with JSON body
    'Accept': 'application/json'      // To indicate client expects JSON response
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Send cookies if backend requires them (server must allow specific origin)
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Default Axios behavior
  }
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return Promise.reject(response);
  },
  async (error) => {
    const { response, config } = error;
    
    // Handle different types of errors
    let errorMessage = '';
    
    if (response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = response.data?.message || 
                    response.data?.error || 
                    response.statusText;
      console.error(`HTTP Error ${response.status}:`, errorMessage);
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timed out. Please try again.';
      console.error('Timeout Error:', error.message);
    } else if (error.message.includes('Network Error')) {
      errorMessage = 'Network error occurred. Please check your connection.';
      console.error('Network Error:', error.message);
    } else if (error.message.includes('Network request failed')) {
      errorMessage = 'Network request failed. Please check your connection.';
      console.error('Network Request Error:', error.message);
    } else {
      errorMessage = error.message || 'An unknown error occurred';
      console.error('Unknown Error:', error.message);
    }

    // Add retry logic for non-authentication errors
    if (config && config.retries === undefined) {
      config.retries = 3; // Maximum number of retries
      config.retryDelay = 1000; // Initial delay in milliseconds
    }

    // Don't retry for 401 (Unauthorized) errors
    if (response?.status === 401) {
      return Promise.reject({ 
        error, 
        message: errorMessage,
        status: response?.status || 401
      });
    }

    // Retry logic
    if (config.retries > 0) {
      config.retries--;
      
      // Calculate exponential backoff delay
      const delay = config.retryDelay * Math.pow(2, 3 - config.retries);
      
      // Add jitter to delay
      const jitter = Math.random() * delay * 0.2;
      const totalDelay = delay + jitter;
      
      console.log(`Retrying request in ${totalDelay}ms...`);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(api(config));
        }, totalDelay);
      });
    }

    return Promise.reject({ 
      error, 
      message: errorMessage,
      status: response?.status || 500
    });
  }
);

// Authentication services
export const authService = {
  login: (data) => api.post('/Auth/Login', data),
  register: (data) => api.post('/Auth/Register', data)
};

// Course services
export const courseService = {
  getAllCourses: () => api.get('/Courses'), // OK
  getCourseById: (id) => api.get(`/Courses/${id}`), // OK
  createCourse: (courseData) => api.post('/Courses', courseData), // OK
  updateCourse: (id, courseData) => api.put(`/Courses/${id}`, courseData), // OK
  deleteCourse: (id) => api.delete(`/Courses/${id}`), // OK
  // Changed: Enroll in a course by creating an enrollment record. Requires userId.
  enrollInCourse: (courseId, userId) => api.post('/Enrollments', { courseId, userId }), 
  getInstructorCourses: () => api.get('/Courses?instructorId=current'), // OK
  // Changed: Get enrollments for a user. Requires userId. Frontend might need to fetch course details separately.
  // Assumes backend /api/Enrollments can be filtered by userId query param.
  getEnrolledCourses: (userId) => api.get(`/Enrollments?userId=${userId}`),
  // Changed: Get enrollments for a course. Assumes backend /api/Enrollments can be filtered by courseId query param.
  getEnrolledStudents: (courseId) => api.get(`/Enrollments?courseId=${courseId}`),
  // Changed: Assign a course to a student by creating an enrollment. Requires studentId (as userId).
  assignCourse: (courseId, studentId) => api.post('/Enrollments', { courseId, userId: studentId }),
  // Changed: Remove a student from a course by deleting the enrollment record. Requires enrollmentId.
  // The calling component will need to fetch the enrollmentId first based on courseId and studentId.
  removeStudentFromCourse: (enrollmentId) => api.delete(`/Enrollments/${enrollmentId}`)
};

// Assessment services
export const assessmentService = {
  getAssessments: () => api.get('/Assessments'), // OK
  getAssessmentById: (id) => api.get(`/Assessments/${id}`), // OK
  createAssessment: (assessmentData) => api.post('/Assessments', assessmentData), // OK
  updateAssessment: (id, assessmentData) => api.put(`/Assessments/${id}`, assessmentData), // OK
  deleteAssessment: (id) => api.delete(`/Assessments/${id}`), // OK
  // Changed: Submit assessment results. resultData should include assessmentId, userId, score, etc.
  submitAssessment: (resultData) => api.post('/Results/results', resultData),
  // Changed: Get results for a specific assessment. Assumes backend /api/Results can be filtered by assessmentId.
  getAssessmentResults: (assessmentId) => api.get(`/Results?assessmentId=${assessmentId}`),
  // Changed: Get results for a specific student. Assumes backend /api/Results can be filtered by userId.
  getStudentResults: (studentId) => api.get(`/Results?userId=${studentId}`)
};

// User services
export const userService = {
  getProfile: () => api.get('/Users/profile'),
  getUserById: (userId) => api.get(`/Users/${userId}`),
  updateProfile: (profileData) => api.put('/Users/profile', profileData),
  updatePassword: (passwordData) => api.put('/Users/password', passwordData),
  getStats: () => api.get('/Users/stats')
};

// Upload services
export const uploadService = {
  uploadFile: (file, courseId) => { // OK - Targets POST /api/Uploads/course/{courseId}
    const formData = new FormData();
    formData.append('file', file);
    // Note: Backend UploadsController.UploadCourseMedia expects courseId in path, which is correct here.
    return api.post(`/Uploads/course/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // Commented out: uploadProfilePicture - Backend endpoint /api/Uploads/profile-picture not found in UploadsController.
  // uploadProfilePicture: (file) => {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   return api.post('/Uploads/profile-picture', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  // },
  uploadCourseImage: (file, courseId) => { // OK - Targets POST /api/Uploads/course-image/{courseId}
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/Uploads/course-image/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // Removed redundant uploadCourseMedia as uploadFile serves the same purpose.
  getMediaUrl: (container, fileName) => { // OK - Targets GET /api/Media/{container}/{fileName}
    return `${api.defaults.baseURL}/Media/${container}/${fileName}`;
  }
};

export default api;
