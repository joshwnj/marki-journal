'use strict'

const async = require('async')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const renderNote = require('./render-note')
const renderTopic = require('./render-topic')

function writeNoteFile (note, dir, cb) {
  const filename = path.join(dir, path.basename(note.filename)).replace(/.md$/, '.html')
  fs.writeFile(filename, renderNote(note), cb)
}

function writeTopicFile (topic, dir, cb) {
  const filename = path.join(dir, path.basename(topic.filename)).replace(/.md$/, '.html')
  fs.writeFile(filename, renderTopic(topic), cb)
}

module.exports = function render (data, opts, cb) {
  const distTopicsDir = opts.distTopicsDir
  const distNotesDir = opts.distNotesDir

  const tasks = [distTopicsDir, distNotesDir].map(function (dir) {
    return mkdirp.bind(null, dir)
  })

  async.parallel(tasks, function (err) {
    if (err) { return cb(err) }

    const tasks = data.notes.map(function (note) {
      return writeNoteFile.bind(null, note, distNotesDir)
    }).concat(data.topics.map(function (topic) {
      return writeTopicFile.bind(null, topic, distTopicsDir)
    }))

    async.parallel(tasks, function (err) {
      if (err) { throw err }
    })
  })
}
