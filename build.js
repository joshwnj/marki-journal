'use strict'

const async = require('async')
const glob = require('glob')

const parseTopicFile = require('./lib/parse-topic-file')
const parseNoteFile = require('./lib/parse-note-file')
const render = require('./lib/render')
const validate = require('./lib/validate')

module.exports = function build (opts, cb) {
  const parseTasks = []

  // parse note files
  parseTasks.push(cb => {
    glob(opts.srcNotesDir + '/*.md', (err, files) => {
      if (err) { return cb(err) }

      console.log('notes: %d', files.length)
      const tasks = files.map(filename => parseNoteFile.bind(null, filename))

      async.parallel(tasks, cb)
    })
  })

  // parse topic files
  parseTasks.push(cb => {
    glob(opts.srcTopicsDir + '/*.md', (err, files) => {
      if (err) { return cb(err) }

      console.log('topics: %d', files.length)
      const tasks = files.map(filename => parseTopicFile.bind(null, filename))

      async.parallel(tasks, cb)
    })
  })

  // parse and render
  async.parallel(parseTasks, (err, res) => {
    if (err) { return cb(err) }

    const data = {
      notes: res[0],
      topics: res[1]
    }

    const errors = validate(data)
    if (errors.length) {
      const err = new Error('validation errors')
      err.errors = errors
      return cb(err)
    }

    render(data, opts, cb)
  })
}
