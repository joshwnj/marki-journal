'use strict'

const normalizeTopicId = require('./normalize-topic-id')

module.exports = function getLinkParts (linkIdentifier) {
  return linkIdentifier.split('/')
    .map(normalizeTopicId)
    .filter(Boolean)
}
