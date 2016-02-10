'use strict'

const async = require('async')
const fs = require('fs')

module.exports = function loadAndProcessAll (filenames, processFunc, cb) {
  const tasks = filenames.map(filename => {
    return (cb) => {
      async.waterfall([
        fs.readFile.bind(null, filename, 'utf8'),
        processFunc,
        // tag the result with the filename
        (res, cb) => {
          res.filename = filename
          cb(null, res)
        }
      ], cb)
    }
  })

  async.parallel(tasks, cb)
}
