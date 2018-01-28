/*
* @Author: d4r
* @Date:   2018-01-28 13:59:19
* @Last Modified by:   d4r
* @Last Modified time: 2018-01-28 14:00:07
*/
module.exports = function getNameCaller () {
	return getNameCaller.caller.name
}