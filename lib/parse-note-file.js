'use strict'

const remark = require('remark')

const walkMdAst = require('./walk-md-ast')

module.exports = function parseFile (raw, cb) {
  const links = []
  const root = remark.parse(raw)

  // walk the entire tree to find wikilinks
  walkMdAst(root, function visit (node) {
    switch (node.type) {
      case 'linkReference':
        links.push(node)
        break
    }
  }, function end () {
    return cb(null, {
      nodes: root.children,
      links: links
    })
  })
}
