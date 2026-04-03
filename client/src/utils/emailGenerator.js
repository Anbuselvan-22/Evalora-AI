/**
 * Generates a unique student email address based on name and roll number
 * Format: <firstname.lastname>.<rollno>@stu.com
 * Ensures no duplicates by normalizing format
 */

/**
 * Generate student email from name and roll number
 * @param {string} studentName - Full name of the student
 * @param {string} rollNumber - Roll number of the student
 * @param {string} domain - Email domain (default: stu.com)
 * @returns {string} Generated email address
 */
export const generateStudentEmail = (studentName, rollNumber, domain = 'stu.com') => {
  if (!studentName || !rollNumber) {
    throw new Error('Student name and roll number are required');
  }

  // Normalize the name: remove special characters, convert to lowercase
  const normalizedName = studentName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '.'); // Replace spaces with dots

  // Normalize roll number: remove special characters, keep alphanumeric
  const normalizedRollNo = rollNumber
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  // Extract just the numeric part for cleaner format
  const numericRoll = normalizedRollNo.replace(/[^0-9]/g, '');

  // Combine name and roll number with dot separator: firstname.lastname.001
  const emailPrefix = `${normalizedName}.${numericRoll}`;

  return `${emailPrefix}@${domain}`;
};

/**
 * Generate multiple email variations for a student (for fallback options)
 * @param {string} studentName - Full name of student
 * @param {string} rollNumber - Roll number of student
 * @param {string} domain - Email domain (default: stu.com)
 * @returns {string[]} Array of possible email variations
 */
export const generateEmailVariations = (studentName, rollNumber, domain = 'stu.com') => {
  const emails = [];
  
  // Split name into parts
  const nameParts = studentName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
  const normalizedRollNo = rollNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Extract just the numeric part for cleaner format
  const numericRoll = normalizedRollNo.replace(/[^0-9]/g, '');

  if (nameParts.length >= 2) {
    // Format: firstname.lastname.001
    emails.push(`${nameParts[0]}.${nameParts[nameParts.length - 1]}.${numericRoll}@${domain}`);
    
    // Format: firstinitial.lastname.001
    emails.push(`${nameParts[0][0]}.${nameParts[nameParts.length - 1]}.${numericRoll}@${domain}`);
    
    // Format: firstname.001
    emails.push(`${nameParts[0]}.${numericRoll}@${domain}`);
  } else {
    // Single name case
    emails.push(`${nameParts[0]}.${numericRoll}@${domain}`);
  }

  // Full name with roll number
  const fullName = nameParts.join('.');
  emails.push(`${fullName}.${numericRoll}@${domain}`);

  // Remove duplicates and return
  return [...new Set(emails)];
};

/**
 * Check if email format is valid for student email
 * @param {string} email - Email to validate
 * @param {string} domain - Expected domain (default: stu.com)
 * @returns {boolean} True if valid student email format
 */
export const isValidStudentEmail = (email, domain = 'stu.com') => {
  const emailRegex = /^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!emailRegex.test(email)) return false;
  
  return email.endsWith(`@${domain}`);
};

/**
 * Extract student information from email
 * @param {string} email - Student email
 * @param {string} domain - Email domain (default: stu.com)
 * @returns {object} Extracted student info
 */
export const extractStudentInfoFromEmail = (email, domain = 'stu.com') => {
  if (!isValidStudentEmail(email, domain)) {
    throw new Error('Invalid student email format');
  }

  const [localPart] = email.split('@');
  
  // Try to extract roll number (assuming it's after the last dot)
  const rollMatch = localPart.match(/\.([0-9]+)$/);
  const rollNumber = rollMatch ? rollMatch[1] : '';
  
  // Extract name part (everything before the last dot and roll number)
  const namePart = localPart.replace(/\.[0-9]+$/, '').replace(/\.$/, '');
  
  return {
    name: namePart.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    rollNumber,
    email
  };
};

/**
 * Format student email for display
 * @param {string} email - Student email
 * @returns {string} Formatted email for display
 */
export const formatStudentEmailForDisplay = (email) => {
  if (!email) return '';
  
  const [localPart, domain] = email.split('@');
  
  // If email is too long, truncate the middle part
  if (localPart.length > 20) {
    const start = localPart.substring(0, 8);
    const end = localPart.substring(localPart.length - 8);
    return `${start}...${end}@${domain}`;
  }
  
  return email;
};
