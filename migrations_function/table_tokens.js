exports.up = function (schema, fn) {
	return schema
		.dropTableIfExists('tokens')
		.createTable('tokens', function (t) {
			t.increments('id').unsigned().primary()
			t.timestamp('created').defaultTo(fn.now()).notNullable()
			t.timestamp('deleted').nullable()
			t.timestamp('updated').nullable()
			t.integer('user_id').unsigned()
			t.foreign('user_id').references('users.id')
			t.integer('iat').notNullable()
			t.text('user_agent').notNullable()
			t.text('certificate_access_token').notNullable()
			t.text('private_access_token').notNullable()
			t.text('private_refresh_token').nullable()
			t.timestamp('private_access_token_expire').nullable()
			t.timestamp('private_refresh_token_expire').nullable()
			t.integer('status').defaultTo(0).notNullable() // 0 normal, 1 deactive, 2 suspend, 3 banned
			t.integer('activation').defaultTo(0).notNullable() // 0 not active, 1 active
		})
}
exports.down = function (schema) {
	return schema.dropTableIfExists('tokens') 
}