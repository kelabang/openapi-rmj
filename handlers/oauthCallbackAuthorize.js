/**
 * Receive code authorization
 *
 * GET: /v2/oauth/callback
 * 
 * query:
 *   code {string} The code authorization from server.
 *   
 */
exports.handler = function oauthCallbackAuthorize(req, res, next) {
  res.send('oauthCallbackAuthorize')
  next()
}
