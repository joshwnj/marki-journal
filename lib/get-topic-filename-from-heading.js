'use strict'

const normalizeTopicId = require('./normalize-topic-id')

module.exports = function getTopicFilenameFromHeading (heading) {
  return normalizeTopicId(heading) + '.html'
}
