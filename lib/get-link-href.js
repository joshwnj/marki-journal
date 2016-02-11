'use strict'

const getLinkParts = require('./get-link-parts')
const getTopicFilenameFromHeading = require('./get-topic-filename-from-heading')

module.exports = function getLinkHref (node) {
  const parts = getLinkParts(node.identifier)
  return [
    getTopicFilenameFromHeading(parts[0]),
    parts[1]
  ].filter(Boolean).join('#')
}
