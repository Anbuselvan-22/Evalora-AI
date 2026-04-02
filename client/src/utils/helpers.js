/**
 * Returns badge level based on average score.
 * @param {number} avgScore
 * @returns {'gold' | 'silver' | 'bronze'}
 */
export function getBadgeLevel(avgScore) {
  if (avgScore >= 80) return 'gold';
  if (avgScore >= 60) return 'silver';
  return 'bronze';
}

/**
 * Formats an ISO date string to a locale date string.
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Formats a numeric score as a percentage string.
 * @param {number} score
 * @returns {string}
 */
export function formatScore(score) {
  return `${score}%`;
}
