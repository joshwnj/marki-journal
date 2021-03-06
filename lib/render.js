'use strict'

const async = require('async')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const renderNote = require('./render-note')
const renderTopic = require('./render-topic')
const renderTopicIndex = require('./render-topic-index')
const getTopicFilename = require('./get-topic-filename')
const flatten = require('./flatten')
const getTopicHeading = require('./get-topic-heading')

function writeNoteFile (note, objects, dir, cb) {
  const filename = path.join(dir, path.basename(note.filename))
  fs.writeFile(filename, renderNote(note, objects), cb)
}

function writeTopicFile (topic, objects, dir, cb) {
  const filename = path.join(dir, getTopicFilename(topic, 'md'))
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
    if (!dir) { return (cb) => cb() }
    return mkdirp.bind(null, dir)
  })

  async.parallel(tasks, function (err) {
    if (err) { return cb(err) }

    const tasks = objects.notes.map(function (note) {
      return writeNoteFile.bind(null, note, objects, distNotesDir)
    }).concat(objects.topics.map(function (topic) {
      return writeTopicFile.bind(null, topic, objects, distTopicsDir)
    }))

    if (opts.format === 'html') {
      tasks.push(writeTopicIndex.bind(null, objects.topics, distTopicsDir))
    }

    // write the search index file
    tasks.push(function (cb) {
      function renderMarkdown (nodes) {
        const remark = require('remark')
        return remark.stringify({
          type: 'root',
          children: nodes
        })
      }

      const indexData = objects.topics.map(function (topic) {
        const topicHeading = getTopicHeading(topic, 0)

        return topic.sections.map((section, i) => {
          const id = `${topicHeading}:${i}`
          const doc = {
            id: id,
            section: i,
            topic: topicHeading,
            heading: getTopicHeading(topic, i),
            body: renderMarkdown(section.nodes),
            filename: topic.filename
          }

          return doc
        })
      })

      const serializedIndexData = JSON.stringify(flatten(indexData))

      fs.writeFile(path.join(distTopicsDir, 'index.json'), serializedIndexData, cb)
    })

    async.parallel(tasks, cb)
  })
}
