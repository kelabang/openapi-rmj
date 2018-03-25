
exports.up = function(knex, Promise) {
	return knex.schema.createTable('user_follow', function(t) {
	  	t.integer('user_id').unsigned()
 		t.foreign('user_id').references('Users.id')
	  	t.integer('follow_id').notNullable()
	  	t.foreign('follow_id').references('Users.id')

	  	t.unique(['user_id', 'follow_id'])
	  	
  })
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('user_follow')
};
