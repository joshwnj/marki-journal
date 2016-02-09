'use strict'

const async = require('async')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const renderNote = require('./render-note')
const renderTopic = require('./render-topic')
const renderTopicIndex = require('./render-topic-index')
const getTopicHeading = require('./get-topic-heading')
const getTopicFilename = require('./get-topic-filename')

function writeNoteFile (note, objects, dir, cb) {
  const filename = path.join(dir, path.basename(note.filename)).replace(/.md$/, '.html')
  fs.writeFile(filename, renderNote(note, objects), cb)
}

function writeTopicFile (topic, objects, dir, cb) {
  const filename = path.join(dir, getTopicFilename(getTopicHeading(topic)))
  fs.writeFile(filename, renderTopic(topic, objects), cb)
}

function writeTopicIndex (topics, dir, cb) {
  const filename = path.join(dir, 'index.html')
  fs.writeFile(filename, renderTopicIndex(topics), cb)
}

module.exports = function render (objects, opts, cb) {
  const distTopicsDir = opts.distTopicsDir
  const distNotesDir = opts.distNotesDir

  const tasks = [distTopicsDir, distNotesDir].map(function (dir) {
    return mkdirp.bind(null, dir)
  })

  async.parallel(tasks, function (err) {
    if (err) { return cb(err) }

    const tasks = objects.notes.map(function (note) {
      return writeNoteFile.bind(null, note, objects, distNotesDir)
    }).concat(objects.topics.map(function (topic) {
      return writeTopicFile.bind(null, topic, objects, distTopicsDir)
    }))

    tasks.push(writeTopicIndex.bind(null, objects.topics, distTopicsDir))

    async.parallel(tasks, cb)
  })
}
