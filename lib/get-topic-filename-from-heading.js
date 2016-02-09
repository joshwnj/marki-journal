'use strict'

const getHeadingId = require('./get-heading-id')

module.exports = function getTopicFilenameFromHeading (heading) {
  return getHeadingId(heading) + '.html'
}
