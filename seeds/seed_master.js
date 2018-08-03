const users = require('./../seeds_function/initial_users')
const feeds = require('./../seeds_function/initial_feeds')
const genres = require('./../seeds_function/initial_genres')
const authors = require('./../seeds_function/initial_authors')
const publishers = require('./../seeds_function/initial_publishers')
const books = require('./../seeds_function/initial_books')

module.exports.seed = function (knex) {
  console.log('seed running')
  let driver
  return users(knex)
    .then(() => feeds(knex))
    .then(() => genres(knex))
    .then(() => authors(knex))
    .then(() => publishers(knex))
    .then(() => books(knex))
}