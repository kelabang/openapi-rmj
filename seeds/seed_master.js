const users = require('./../seeds_function/inital_users')
const feeds = require('./../seeds_function/inital_feeds')

module.exports.seed = function (knex) {
  console.log('seed running')
  let driver
  return users(knex)
    .then(() => feeds(knex))
}