/*
* @Author: Imam
* @Date:   2018-05-30 01:31:05
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-30 03:12:24
*/

exports.up = function(schema, fn) {
 	return schema.createTable('profiles', function (t) {
 		// t.increments('id').unsigned().primary()

 		t.timestamp('created').defaultTo(fn.now()).notNullable()
 		t.timestamp('deleted').nullable()
 		t.timestamp('updated').nullable()

 		t.text('about').nullable()
 		t.enum('sex', ['male', 'female', 'other']).defaultTo('other')
 		t.dateTime('birthday').nullable()
 		t.text('preferences').nullable()

 		t.integer('user_id').unsigned()
 		t.foreign('user_id').references('users.id')
 	})
};

exports.down = function(schema) {
	return schema.dropTableIfExists('profiles') 
};
