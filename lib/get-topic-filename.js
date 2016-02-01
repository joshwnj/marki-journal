'use strict'

const getHeadingId = require('./get-heading-id')

module.exports = function getTopicFilename (heading) {
  return getHeadingId(heading) + '.html'
}
