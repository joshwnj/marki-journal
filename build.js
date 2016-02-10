'use strict'

const async = require('async')
const glob = require('glob')

const loadAndProcessAll = require('./lib/load-and-process-all')
const parseTopicFile = require('./lib/parse-topic-file')
const parseNoteFile = require('./lib/parse-note-file')
const render = require('./lib/render')
const validate = require('./lib/validate')

function loadNotes (dir, cb) {
  glob(dir + '/*.md', (err, filenames) => {
    if (err) { return cb(err) }

    console.log('notes: %d', filenames.length)
    loadAndProcessAll(filenames, parseNoteFile, cb)
  })
}

function loadTopics (dir, cb) {
  glob(dir + '/*.md', (err, filenames) => {
    if (err) { return cb(err) }

    console.log('topics: %d', filenames.length)
    loadAndProcessAll(filenames, parseTopicFile, cb)
  })
}

module.exports = function build (opts, cb) {
  const tasks = []

  // load src files
  tasks.push(loadNotes.bind(null, opts.srcNotesDir))
  tasks.push(loadTopics.bind(null, opts.srcTopicsDir))

  // parse, validate, render
  async.parallel(tasks, (err, res) => {
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
