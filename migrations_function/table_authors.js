/*
* @Author: Imam
* @Date:   2018-05-29 14:18:30
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-30 03:11:43
*/

exports.up = function(schema, fn) {
	return schema
	.dropTableIfExists('authors')
	.createTable('authors', function (t) {
		t.increments('id').unsigned().primary()

		t.timestamp('created').defaultTo(fn.now()).notNullable()
		t.timestamp('deleted').nullable()
		t.timestamp('updated').nullable()

		t.string('name', 80).notNullable()

		t.integer('user_id').unsigned()
		t.foreign('user_id').references('users.id')
		
	})
};

exports.down = function(schema) {
	return schema.dropTableIfExists('authors') 
};
