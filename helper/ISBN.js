/*
* @Author: Imam
* @Date:   2018-02-03 20:15:40
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-11 04:32:08
*/

const debug = require('debug')('rumaji:ISBN')
const node_isbn = require('node-isbn')

const ISBN = {
    resolve: (isbn) => {
        debug('resolve ISBN', isbn)
        return new Promise((res, rej) => {
            node_isbn.resolve(isbn, function (err, book) {
                debug('network responded ' + isbn)
                if(err) {
                    debug('network error '+ isbn)
                    res(null)
                }else{
                    debug('network data ' + isbn)
                    res(book)
                }
            })
        })
    },
    resolves: (isbns = []) => {
        debug('resolves ISBN', isbns)
        const uniquep = [...isbns]
        const p = uniquep.map(isbn => ISBN.resolve(isbn))
        return Promise.all(p)
    },
    test: () => {
        node_isbn.resolve('9799569052', function (err, book) {
            if (err) {
                console.log('Book not found', err);
            } else {
                console.log('Book found %j', book);
            }
        });
    }
}

module.exports = ISBN 