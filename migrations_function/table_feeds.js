/*
* @Author: Imam
* @Date:   2018-05-29 13:21:03
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-30 03:11:56
*/

exports.up = function(schema, fn) {
 	return schema
 	.dropTableIfExists('feeds')
 	.createTable('feeds', function (t) {
 		t.increments('id').unsigned().primary()

 		t.timestamp('created').defaultTo(fn.now()).notNullable()
 		t.timestamp('deleted').nullable()
 		t.timestamp('updated').nullable()

 		t.text('content').notNullable()
 		t.integer('type').defaultTo(1).notNullable()

 		t.integer('user_id').unsigned()
 		t.foreign('user_id').references('users.id')

 		t.integer('feed_id').unsigned()
 		t.foreign('feed_id').references('feeds.id')

 	})
}

exports.down = function(schema) {
	return schema.dropTableIfExists('feeds') 
}
