
exports.up = function(knex, Promise) {
 	return knex.schema.createTable('stories', function (t) {
 		t.increments('id').unsigned().primary()
 		// t.integer('id').notNullable().primary()
 		t.timestamp('created').defaultTo(knex.fn.now()).notNullable()
 		t.timestamp('deleted').nullable()
 		t.timestamp('updated').nullable()

 		t.string('title').notNullable()
 		t.text('content').notNullable()
 		t.enum('status', ['draft', 'published', 'deleted']).defaultTo('draft')
 		t.integer('category_id').nullable()

 	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('stories') 
};
