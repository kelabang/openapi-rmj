
exports.up = function(schema, fn) {
 	return schema
 	.dropTableIfExists('stories')
 	.createTable('stories', function (t) {
 		t.increments('id').unsigned().primary()
 		// t.integer('id').notNullable().primary()
 		t.timestamp('created').defaultTo(fn.now()).notNullable()
 		t.timestamp('deleted').nullable()
 		t.timestamp('updated').nullable()

 		t.string('title').notNullable()
 		t.text('content').notNullable()
 		t.enum('status', ['draft', 'published', 'deleted']).defaultTo('draft')
 		t.integer('category_id').nullable()
 		t.integer('user_id').unsigned()
 		t.foreign('user_id').references('users.id')
 	})
};

exports.down = function(schema, fn) {
	return schema.dropTableIfExists('stories') 
};
