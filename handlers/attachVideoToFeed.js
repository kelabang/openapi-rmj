/**
 * Attach video to feed
 *
 * PUT: /v2/feed/{feedId}/video
 * 
 * path:
 *   feedId {number} id of feed.
 *   
 * body:
 *   source {string}
 *   key {number}
 *   md5 {string}
 *   size {number}
 *   
 */
exports.handler = function attachVideoToFeed(req, res, next) {
  res.send('attachVideoToFeed')
  next()
}
