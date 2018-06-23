const user_profile = require('./table_user_profiles')
const user_follow = require('./table_user_follow')
const user_socials = require('./table_user_socials')
const tag_feeds_users = require('./table_tag_feeds_users')
const tag_feeds_books = require('./table_tag_feeds_books')
const feed_books = require('./table_feed_books')

exports.up = function(schema, fn) {
  	schema = user_profile.up(schema, fn)
  	schema = user_socials.up(schema, fn)
  	schema = feed_books.up(schema, fn)
  	
  	schema = user_follow.up(schema, fn)

  	schema = tag_feeds_users.up(schema, fn)
  	schema = tag_feeds_books.up(schema, fn)

  	return schema
};

exports.down = function(schema) {

  	schema = tag_feeds_books.down(schema)
	schema = tag_feeds_users.down(schema)

	schema = user_follow.down(schema)

	schema = feed_books.down(schema)
	schema = user_socials.down(schema)
	schema = user_profile.down(schema)
	return schema
};
