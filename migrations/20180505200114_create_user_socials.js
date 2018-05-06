
exports.up = function(knex, Promise) {
	return knex.schema.createTable('user_socials', function (t) {
		
		t.integer('user_id').unsigned()
		t.foreign('user_id').references('users.id')
		t.integer('social_type').notNullable()
		t.integer('social_id').notNullable()

		t.timestamp('created').defaultTo(knex.fn.now()).notNullable()

		t.unique(['user_id', 'social_id', 'social_type'])
	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('user_socials')
};
