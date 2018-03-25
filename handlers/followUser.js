/**
 * Follow user
 *
 * POST: /v2/user/{userId}/follow
 * 
 * path:
 *   userId {int64} User ID for following user.
 *   
 */
exports.handler = function followUser(req, res, next) {
  res.send('followUser')
  next()
}
