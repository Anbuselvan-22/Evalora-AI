// Shared storage for dynamically created student credentials
// This allows student email creation and authentication to work together

const studentCredentials = new Map();

// Store student credentials
export const storeStudentCredentials = (studentId, email, password, name) => {
  const credentials = {
    id: studentId,
    email: email.toLowerCase(),
    password,
    name,
    role: 'student',
    createdAt: new Date()
  };
  
  studentCredentials.set(email.toLowerCase(), credentials);
  console.log(`✅ Stored credentials for ${email} (${name})`);
  return credentials;
};

// Get student credentials by email
export const getStudentCredentials = (email) => {
  return studentCredentials.get(email.toLowerCase());
};

// Check if student exists
export const studentExists = (email) => {
  return studentCredentials.has(email.toLowerCase());
};

// Get all student credentials (for debugging)
export const getAllStudentCredentials = () => {
  return Array.from(studentCredentials.values());
};

// Remove student credentials
export const removeStudentCredentials = (email) => {
  const deleted = studentCredentials.delete(email.toLowerCase());
  if (deleted) {
    console.log(`🗑️ Removed credentials for ${email}`);
  }
  return deleted;
};

export default {
  storeStudentCredentials,
  getStudentCredentials,
  studentExists,
  getAllStudentCredentials,
  removeStudentCredentials
};
