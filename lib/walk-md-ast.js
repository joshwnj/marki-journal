'use strict'

const async = require('async')

module.exports = function walkMdAst (node, visit, cb) {
  visit(node)

  const children = node.children || []
  if (!children.length) { return cb() }

  const tasks = children.map((child) => {
    return walkMdAst.bind(null, child, visit)
  })

  async.series(tasks, cb)
}
