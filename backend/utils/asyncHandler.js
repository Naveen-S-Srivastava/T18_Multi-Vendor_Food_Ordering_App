/**
 * Async handler to avoid try-catch in every controller
 * @param {Function} fn - Async function
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
