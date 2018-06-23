/*
* @Author: Imam
* @Date:   2018-06-20 21:17:33
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-22 00:32:07
*/

exports.up = function (schema, fn) {
	return schema.createTable('tag_feeds_books', function (t) {
		t.increments('id').unsigned() // for .through bookshelf implementation, need extra id

		t.integer('book_id').unsigned()
		t.foreign('book_id').references('books.id')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')

		t.integer('feed_id').unsigned()
		t.foreign('feed_id').references('feeds.id')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			
		t.timestamp('created').defaultTo(fn.now()).notNullable()
		t.timestamp('deleted').nullable()
		t.timestamp('updated').nullable()

		t.unique(['book_id', 'feed_id'])

	})
}

exports.down = function (schema, fn) {
	return schema.dropTableIfExists('tag_feeds_books')
}