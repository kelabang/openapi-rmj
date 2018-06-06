/*
* @Author: Imam
* @Date:   2018-05-30 01:45:54
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-30 03:11:52
*/

exports.up = function(schema, fn) {
	return schema.createTable('feed_books', function (t) {
		t.increments('id').unsigned().primary()

		t.timestamp('created').defaultTo(fn.now()).notNullable()
		t.timestamp('deleted').nullable()
		t.timestamp('updated').nullable()

		t.integer('feed_id').unsigned().notNullable()
		t.foreign('feed_id').references('feeds.id')

		t.integer('book_id').unsigned().notNullable()
		t.foreign('book_id').references('books.id')

	})	
};

exports.down = function(schema, fn) {
	return schema.dropTableIfExists('feed_books')
};
