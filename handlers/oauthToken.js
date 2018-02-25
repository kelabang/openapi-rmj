/**
 * Request access token
 *
 * GET: /v2/oauth/token
 * 
 * query:
 *   client_id {string} The application's client ID (how the API identifies the application).
 *   client_secret {string}
 *   grant_type {string}
 *   code {string}
 *   redirect_uri {string} Where the service redirects the user-agent after an authorization code is granted.
 *   
 */
exports.handler = function oauthToken(req, res, next) {
  res.send('oauthToken')
  next()
}
