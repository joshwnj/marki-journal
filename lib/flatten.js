'use strict'

module.exports = function flatten (arr) {
  return arr.reduce((a, b) => a.concat(b), [])
}
