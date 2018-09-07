module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'OPENAPI',
      script    : 'index.js',
      env: {
	env:'staging',
        COMMON_VARIABLE: 'true'
      },
      env_production : {
	env: 'staging',
        NODE_ENV: 'production'
      }
    }
  ]
}
