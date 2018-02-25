
exports.up = function(knex, Promise) {
	return knex.schema.createTable('users', function (t) {
		t.increments('id').unsigned().primary()

		t.timestamp('created').defaultTo(knex.fn.now()).notNullable()
		t.timestamp('deleted').nullable()
		t.timestamp('updated').nullable()

		t.string('username').notNullable()
		t.string('email', 60).notNullable()
		t.string('password', 65).notNullable()

		t.string('firstname').nullable()
		t.string('lastname').nullable()
		t.string('phone').nullable()

		t.integer('status').defaultTo(0).notNullable() // 0 normal, 1 deactive, 2 suspend, 3 banned
		t.integer('activation').defaultTo(0).notNullable() // 0 not active, 1 active

	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users') 
};
