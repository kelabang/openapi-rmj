/**
 * Authentication with twitter
 *
 * POST: /v2/auth/twitter
 * 
 * body:
 *   oauth_token {string}
 *   oauth_token_secret {string}
 *   
 */
exports.handler = function authTwitter(req, res, next) {
  res.send('authTwitter')
  next()
}
