'use strict'

module.exports = function normalizeTopicId (raw) {
  return raw.trim().toLowerCase().replace(/[^\w]+/g, '-')
}
