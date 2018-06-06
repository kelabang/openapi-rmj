/*
* @Author: Imam
* @Date:   2018-05-29 14:26:58
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-30 03:12:05
*/

exports.up = function(schema, fn) {
	return schema
	.dropTableIfExists('publishers')
	.createTable('publishers', function (t) {
		t.increments('id').unsigned().primary()

		t.timestamp('created').defaultTo(fn.now()).notNullable()
		t.timestamp('deleted').nullable()
		t.timestamp('updated').nullable()

		t.string('name', 80).notNullable()
	})
};

exports.down = function(schema, fn) {
	return schema.dropTableIfExists('publishers') 
};
