/**
 * Request link authorize
 *
 * GET: /v2/oauth/authorize
 * 
 * query:
 *   client_id {string} The application's client ID (how the API identifies the application).
 *   redirect_uri {string} Where the service redirects the user-agent after an authorization code is granted.
 *   response_type {string} Specifies that your application is requesting an authorization code grant.
 *   scope {string} Specifies the level of access that the application is requesting.
 *   
 */
exports.handler = function oauthAuthorize(req, res, next) {
  res.send('oauthAuthorize')
  next()
}
