/**
 * Shared validation utilities for ShipGod forms
 */

/**
 * Validates an email address format
 * @param {string} email
 * @returns {{ valid: boolean, message: string }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required' };
  }

  const trimmed = email.trim().toLowerCase();

  // RFC 5322 simplified — covers 99.9% of real-world addresses
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  // Must have a dot in the domain part (e.g., user@domain.com)
  const domainPart = trimmed.split('@')[1];
  if (!domainPart || !domainPart.includes('.')) {
    return { valid: false, message: 'Please enter a valid email address (e.g., name@example.com)' };
  }

  // TLD must be at least 2 characters
  const tld = domainPart.split('.').pop();
  if (tld.length < 2) {
    return { valid: false, message: 'Please enter a valid email domain' };
  }

  return { valid: true, message: '' };
}

/**
 * Validates an Indian mobile number
 * Accepts: +91 98765 43210, 09876543210, 9876543210, +919876543210, etc.
 * @param {string} phone
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return { valid: false, message: 'Phone number is required' };
  }

  // Strip spaces, dashes, and parentheses for validation
  const cleaned = phone.trim().replace(/[\s\-\(\)]/g, '');

  // Indian mobile: optional +91 or 0 prefix, then 10-digit number starting with 6-9
  const indianMobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

  if (!indianMobileRegex.test(cleaned)) {
    return { valid: false, message: 'Please enter a valid 10-digit Indian mobile number' };
  }

  return { valid: true, message: '' };
}

/**
 * Validates a person's name
 * @param {string} name
 * @returns {{ valid: boolean, message: string }}
 */
export function validateName(name) {
  if (!name || !name.trim()) {
    return { valid: false, message: 'Name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }

  if (trimmed.length > 100) {
    return { valid: false, message: 'Name is too long' };
  }

  // Only letters, spaces, hyphens, dots, and apostrophes
  const nameRegex = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+([\s'.\\-][a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)*$/;
  if (!nameRegex.test(trimmed)) {
    return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and dots' };
  }

  return { valid: true, message: '' };
}
