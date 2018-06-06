/*
* @Author: Imam
* @Date:   2018-05-30 01:45:41
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-31 21:23:18
*/


exports.up = function(schema, fn) {
	return schema.createTable('user_socials', function (t) {
		
		t.integer('user_id').unsigned()
		t.foreign('user_id').references('users.id')
		t.integer('social_type').notNullable()
		t.string('social_id', 28).notNullable()

		t.timestamp('created').defaultTo(fn.now()).notNullable()

		t.unique(['user_id', 'social_id', 'social_type'])
	})
};

exports.down = function(schema, fn) {
	return schema.dropTableIfExists('user_socials')
};
