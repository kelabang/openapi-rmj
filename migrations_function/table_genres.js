exports.up = function (schema, fn) {
	return schema
		.dropTableIfExists('genres')
		.createTable('genres', function (t) {
			t.increments('id').unsigned().primary()
			t.timestamp('created').defaultTo(fn.now()).notNullable()
			t.timestamp('deleted').nullable()
			t.timestamp('updated').nullable()
			t.string('name', 80).notNullable()
		})
}

exports.down = function (schema) {
	return schema.dropTableIfExists('genres') 
}