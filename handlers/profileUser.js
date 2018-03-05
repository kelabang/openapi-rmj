/**
 * Profile user
 *
 * GET: /v2/profile/{username}
 * 
 * path:
 *   username {string} Username of user to return.
 *   
 */
exports.handler = function profileUser(req, res, next) {
  res.send('profileUser')
  next()
}
