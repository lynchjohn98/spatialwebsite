// utils/server-helpers.ts
// This file contains helper functions that can be used in server-side code

/**
 * Generates a random alphanumeric student code
 * @returns A 6-character uppercase alphanumeric code
 */


export function generateStudentCode() {
    // Implementation that works on the server
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  /**
   * Validates whether a student code is in the correct format
   * @param code The student code to validate
   * @returns True if the code is valid, false otherwise
   */
  export function validateStudentCode(code) {
    // Check if code is 6 characters long and contains only uppercase letters and numbers
    return /^[A-Z0-9]{6}$/.test(code);
  }