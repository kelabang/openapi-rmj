const users = require('./../migrations_function/table_user')
const genres = require('./../migrations_function/table_genres')
const tokens = require('./../migrations_function/table_tokens')
const feeds = require('./../migrations_function/table_feeds')
const authors = require('./../migrations_function/table_authors')
const publishers = require('./../migrations_function/table_publishers')
const stories = require('./../migrations_function/table_stories')
const books = require('./../migrations_function/table_books')
const details = require('./../migrations_function/proc_detail')

exports.up = function(knex, Promise) {
	let {schema, fn} = knex

	schema = users.up(schema, fn) 
	schema = genres.up(schema, fn)
	schema = publishers.up(schema, fn)
	schema = authors.up(schema, fn)
	schema = books.up(schema, fn)
	schema = tokens.up(schema, fn)
	schema = feeds.up(schema, fn)
	schema = stories.up(schema, fn)

	schema = details.up(schema, fn)
	
	return schema
}

exports.down = function(knex, Promise) {
	let {schema} = knex
	
	schema = details.down(schema)

	schema = stories.down(schema)
	schema = books.down(schema)
	schema = publishers.down(schema)
	schema = authors.down(schema)
	schema = feeds.down(schema)
	schema = tokens.down(schema)
	schema = genres.down(schema)
	schema = users.down(schema)
	return schema
}
