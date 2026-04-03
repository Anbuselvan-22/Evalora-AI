import apiClient from './apiClient';
import { generateStudentEmail, generateEmailVariations } from '../utils/emailGenerator';

export const getDashboard = async (signal) => {
  const response = await apiClient.get('/student/dashboard', { signal });
  return response.data.data;
};

export const getResults = async (signal) => {
  const response = await apiClient.get('/student/results', { signal });
  return response.data.data;
};

export const getResultById = async (id, signal) => {
  const response = await apiClient.get(`/student/results/${id}`, { signal });
  return response.data.data;
};

export const getAnalytics = async (signal) => {
  const response = await apiClient.get('/student/analytics', { signal });
  return response.data.data;
};

export const getParentData = async (signal) => {
  const response = await apiClient.get('/agents/parent', { signal });
  return response.data.data;
};

export const getStudentProfile = async (signal) => {
  const response = await apiClient.get('/student/profile', { signal });
  return response.data.data;
};

export const checkStudentEmailExists = async (studentData, signal) => {
  const { name, rollNumber, domain = 'example.com' } = studentData;
  
  try {
    const response = await apiClient.post('/student/check-email', {
      name,
      rollNumber,
      domain
    }, { signal });
    
    return response.data; // Returns { exists: boolean, email?: string }
  } catch (error) {
    console.error('Error checking student email:', error);
    return { exists: false };
  }
};

export const createStudentEmail = async (studentData, signal) => {
  const { name, rollNumber, domain = 'example.com' } = studentData;
  
  // Generate primary email
  const email = generateStudentEmail(name, rollNumber, domain);
  
  // Generate backup options in case of duplicates
  const emailOptions = generateEmailVariations(name, rollNumber, domain);
  
  try {
    const response = await apiClient.post('/public/create-student-email', {
      studentId: studentData.studentId,
      name: studentData.name,
      rollNumber: studentData.rollNumber,
      primaryEmail: email,
      emailOptions,
      domain
    }, { signal });
    
    return response.data;
  } catch (error) {
    // If primary email fails, try alternatives
    for (const alternativeEmail of emailOptions.slice(1)) {
      try {
        const response = await apiClient.post('/public/create-student-email', {
          ...studentData,
          primaryEmail: alternativeEmail,
          emailOptions,
          domain
        }, { signal });
        
        return {
          ...response.data,
          email: alternativeEmail,
          usedAlternative: true
        };
      } catch (altError) {
        continue; // Try next option
      }
    }
    
    throw new Error('Unable to create unique email address');
  }
};

export const getStudentEmail = async (studentId, signal) => {
  const response = await apiClient.get(`/student/email/${studentId}`, { signal });
  return response.data;
};

export const updateStudentEmail = async (studentId, emailData, signal) => {
  const response = await apiClient.put(`/student/email/${studentId}`, emailData, { signal });
  return response.data;
};

export const sendEvaluationNotification = async (evaluationData, signal) => {
  const response = await apiClient.post('/student/send-evaluation-notification', evaluationData, { signal });
  return response.data;
};

export const getStudentNotifications = async (studentId, signal) => {
  const response = await apiClient.get(`/student/notifications/${studentId}`, { signal });
  return response.data;
};

export const createEvaluationNotification = async (evaluationData, signal) => {
  const response = await apiClient.post('/student/notifications/evaluation', evaluationData, { signal });
  return response.data;
};

export const createTeacherNotification = async (notificationData, signal) => {
  const response = await apiClient.post('/teacher/notifications', notificationData, { signal });
  return response.data;
};

export const getTeacherNotifications = async (signal) => {
  const response = await apiClient.get('/teacher/notifications', { signal });
  return response.data;
};

export const markNotificationAsRead = async (notificationId, signal) => {
  const response = await apiClient.patch(`/student/notifications/${notificationId}/read`, {}, { signal });
  return response.data;
};

export const markAllNotificationsAsRead = async (studentId, signal) => {
  const response = await apiClient.patch(`/student/notifications/${studentId}/read-all`, {}, { signal });
  return response.data;
};

export const deleteNotification = async (notificationId, signal) => {
  const response = await apiClient.delete(`/student/notifications/${notificationId}`, { signal });
  return response.data;
};

export const getUnreadNotificationCount = async (studentId, signal) => {
  const response = await apiClient.get(`/student/notifications/${studentId}/unread-count`, { signal });
  return response.data.count;
};
