/**
 * Get all comments on feed
 *
 * GET: /v2/feed/{feedId}/comment
 * 
 * path:
 *   feedId {number} Id of feed.
 *   
 */
exports.handler = function getCommentOnFeed(req, res, next) {
  res.send('getCommentOnFeed')
  next()
}
