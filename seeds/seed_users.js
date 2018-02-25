
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'admin', email: 'imam.tauhid.dar@gmail.com', password: 'rumaji'},
        {id: 2, username: 'kucingbelang4', email: 'kuc@rumaji.com', password: 'rumaji'},
        {id: 3, username: 'kelabang', email: 'kel@rumaji.com', password: 'rumaji'},
      ]);
    });
};
