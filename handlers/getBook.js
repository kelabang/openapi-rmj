/**
 * List of indexed Books
 *
 * GET: /v2/book
 * 
 */

const Debug = require('debug')
const Books = require('./../models/Book').collection
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function getBook(req, res, next) {
  const name = getNameCaller()
  debug = Debug('rumaji:'+name)

  function modelQuery () {
  	try {
  		debug('book fething')
      const {
        id,
        title,
        isbn,
        mode
      } = req.query

  		const limit = 15

      let fn = '';

      switch (mode) {
        case 'next':
          fn = 'bookMoreNext'
        break;
        case 'prev':
          fn = 'bookMorePrev'
        break;
        default: 
          fn = 'book'
      }

      const isbn13 = isbn

  		return Books[fn]({id, title, isbn, isbn13})

  	}
  	catch (err) {
  		debug('book fetch failed')
  		console.error(err)
  		return false
  	}
  }

  function preResponseHandler (data) {
  	debug('pre-response handler')
  	let code = 200
  	if(typeof data == 'boolean' && !data) code = 503
  	return {
  		code,
  		data,
  		name
  	}
  }

  function postResponseHandler(data) {
  	debug('post-response handler')
  	res.send(data.code, data)
  	next()
  }

  const tasks = [
  	modelQuery,
  	preResponseHandler,
  	createResponseHandler(name, postResponseHandler)
  ]

  return pipeline(tasks)

}
