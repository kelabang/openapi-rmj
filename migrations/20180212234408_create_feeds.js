
exports.up = function(knex, Promise) {
 	return knex.schema.createTable('feeds', function (t) {
 		t.increments('id').unsigned().primary()

 		t.timestamp('created').defaultTo(knex.fn.now()).notNullable()
 		t.timestamp('deleted').nullable()
 		t.timestamp('updated').nullable()

 		t.text('content').notNullable()
 		t.integer('type').defaultTo(1).notNullable()

 		t.integer('user_id').unsigned()
 		t.foreign('user_id').references('users.id')

 		t.integer('feed_id').unsigned()
 		t.foreign('feed_id').references('feeds.id')

 	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('feeds') 
};
