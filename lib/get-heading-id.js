'use strict'

module.exports = function getHeadingId (raw) {
  return raw.trim().toLowerCase().replace(/[^\w]+/g, '-')
}
