'use strict'

const normalizeTopicId = require('./normalize-topic-id')

module.exports = function getTopicFilenameFromHeading (heading, ext) {
  ext = ext || 'html'
  return normalizeTopicId(heading) + '.' + ext
}
