'use strict'

const async = require('async')
const glob = require('glob')
const path = require('path')

const parseTopicFile = require('./lib/parse-topic-file')
const parseNoteFile = require('./lib/parse-note-file')
const render = require('./lib/render')

const journalDir = path.join(__dirname, '..', '_data')
const srcDir = path.join(journalDir, 'src')
const srcTopicsDir = path.join(srcDir, 'topics')
const srcNotesDir = path.join(srcDir, 'notes')

const distDir = path.join(journalDir, 'dist')
const distTopicsDir = path.join(distDir, 'topics')
const distNotesDir = path.join(distDir, 'notes')

const parseTasks = []

// parse note files
parseTasks.push(function (cb) {
  glob(srcNotesDir + '/*.md', function (err, files) {
    if (err) { return cb(err) }

    const tasks = files.map(function (filename) {
      return parseNoteFile.bind(null, filename)
    })

    async.parallel(tasks, cb)
  })
})

// parse topic files
parseTasks.push(function (cb) {
  glob(srcTopicsDir + '/*.md', function (err, files) {
    if (err) { return cb(err) }

    const tasks = files.map(function (filename) {
      return parseTopicFile.bind(null, filename)
    })

    async.parallel(tasks, cb)
  })
})

// parse and render
async.parallel(parseTasks, function (err, res) {
  if (err) { throw err }

  const data = {
    notes: res[0],
    topics: res[1]
  }
  const opts = {
    distTopicsDir: distTopicsDir,
    distNotesDir: distNotesDir
  }

  // TODO: validate

  render(data, opts, function (err) {
    if (err) { throw err }

    console.log('ok')
  })
})

