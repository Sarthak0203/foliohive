// lib/utils.js
import { twMerge } from "tailwind-merge"
import { clsx } from "clsx"

/**
 * Merges class names efficiently, handling:
 * - Multiple classes
 * - Conditional classes
 * - Undefined/null values
 * - Duplicate classes
 * - Arrays of classes
 * - Tailwind classes (using twMerge)
 * 
 * @param {...(string|boolean|undefined|null|Array)} classes - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...classes) {
  return twMerge(
    classes
      .flat()
      .filter(Boolean)
      .join(' ')
      .trim()
      .split(/\s+/)
      .filter((value, index, self) => self.indexOf(value) === index)
      .join(' ')
  );
}

/**
 * Conditionally joins class names
 * @param {Object} classes - Object with class names as keys and conditions as values
 * @returns {string} - Joined class names based on conditions
 */
export function classNames(classes) {
  return Object.entries(classes)
    .filter(([_, condition]) => Boolean(condition))
    .map(([className]) => className)
    .join(' ');
}

/**
 * Formats a number with commas as thousands separators
 * @param {number} number - The number to format
 * @returns {string} Formatted number
 */
export function formatNumber(number) {
  return number.toLocaleString('en-US');
}

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncates text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, length) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Example usage:
/*
cn('base-class', 
   condition && 'conditional-class',
   ['array-class-1', 'array-class-2'],
   undefined,
   null,
   false && 'wont-show',
   'duplicate duplicate')

classNames({
  'base-class': true,
  'active': isActive,
  'disabled': isDisabled
})
*/