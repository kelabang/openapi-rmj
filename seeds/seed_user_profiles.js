
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('profiles').del()
    .then(function () {
      // Inserts seed entries
      return knex('profiles').insert([
        {user_id: 1, about: 'ini about'},
        {user_id: 2, about: 'ini about'},
        {user_id: 3, about: 'ini about'},
      ]);
    });
};
