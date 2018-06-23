/*
* @Author: Imam
* @Date:   2018-06-20 21:17:33
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-22 00:32:17
*/

exports.up = function (schema, fn) {
	return schema.createTable('tag_feeds_users', function (t) {
		t.increments('id').unsigned()  // for .through bookshelf implementation, need extra pivot id
		t.integer('user_id').unsigned()
		t.foreign('user_id').references('users.id')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')

		t.integer('feed_id').unsigned()
		t.foreign('feed_id').references('feeds.id')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')

		t.timestamp('created').defaultTo(fn.now()).notNullable()
		t.timestamp('deleted').nullable()
		t.timestamp('updated').nullable()

		t.unique(['user_id', 'feed_id'])

	})
}

exports.down = function (schema, fn) {
	return schema.dropTableIfExists('tag_feeds_users')
}