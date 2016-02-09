'use strict'

const h = require('hyperscript')

const getTopicHeading = require('./get-topic-heading')
const getTopicFilename = require('./get-topic-filename')

function renderItem (topic) {
  const heading = getTopicHeading(topic)
  const href = `./${getTopicFilename(topic)}`

  return h('div.topic', [
    h('a', { href: href }, heading)
  ])
}

module.exports = function renderTopicIndex (topics) {
  return h('div.index', topics.map(renderItem))
    .outerHTML
}
