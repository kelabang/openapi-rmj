
exports.up = function(knex, Promise) {
 	return knex.schema.createTable('profiles', function (t) {
 		// t.increments('id').unsigned().primary()

 		t.timestamp('created').defaultTo(knex.fn.now()).notNullable()
 		t.timestamp('deleted').nullable()
 		t.timestamp('updated').nullable()

 		t.text('about').nullable()
 		t.enum('sex', ['male', 'female', 'other']).defaultTo('other')
 		t.dateTime('birthday').nullable()
 		t.text('preferences').nullable()

 		t.integer('user_id').unsigned()
 		t.foreign('user_id').references('Users.id')
 	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('profiles') 
};