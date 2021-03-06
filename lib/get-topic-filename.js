'use strict'

const getTopicHeading = require('./get-topic-heading')
const getTopicFilenameFromHeading = require('./get-topic-filename-from-heading')

module.exports = function getTopicFilename (topic, ext) {
  return getTopicFilenameFromHeading(getTopicHeading(topic), ext)
}
