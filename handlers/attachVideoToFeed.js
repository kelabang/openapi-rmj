/**
 * Attach video to feed
 *
 * PUT: /v2/feed/{feedId}/video
 * 
 * path:
 *   feedId {number} id of feed.
 *   
 * body:
 *   source {string}
 *   key {string}
 *   md5 {string}
 *   size {string}
 *   
 */

const Debug = require('debug')
const _ = require('lodash')

const Feed = require('./../models/Feed')
const Feeds = require('./../models/Feed').collection
const Video = require('./../models/Video')

const JWP = require('./../helper/JWP')
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function attachVideoToFeed(req, res, next) {
  
  const name = getNameCaller()
  debug = Debug('rumaji:'+name)

  function modelQuery () {
  	try {
  		const {
  			feedId
  		} = req.params
  		const {
  			source,
  			key, 
  			md5,
  			size
  		} = req.body
  		debug('feed finding')
  		const videop = Feed.query({where: {id: feedId}}).fetch()
  		const feedp = JWP.getVideoByKey(key)
  		return Promise.all([
  			videop,
  			feedp
  		]).then(([feed, video]) => {
  			debug('fetch all promise')
  			console.log('return promise video', video)
  			console.log('return promise feed', feed)
  			const {
  				video: {
  					duration,
  					title,
  				}
  			} = video
  			const toInsert = {
  				title,
  				type: 'jwp',
  				size,
  				md5,
  				key,
  				feed_id: feed.get('id')
  			}
  			debug('toInsert data ', toInsert)
  			return new Video(toInsert).save()
  				.catch(err => {
  					debug('catch in promise')
  					debug('video create failed')
  					console.error(err)
  					return err
  				})
  		})
  	}
  	catch (err) {
  		debug('feed find failed')
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
  	res.send(data.code,data)
  	next()
  }

  const tasks = [
  	modelQuery,
  	preResponseHandler,
  	createResponseHandler(name, postResponseHandler)
  ]

  return pipeline(tasks)

}
