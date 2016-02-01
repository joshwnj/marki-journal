'use strict'

const fs = require('fs')
const remark = require('remark')

const walkMdAst = require('./walk-md-ast')

module.exports = function parseFile (filename, cb) {
  fs.readFile(filename, 'utf8', function (err, raw) {
    if (err) { return cb(err) }

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
      const res = {
        filename: filename,
        nodes: root.children,
        links: links
      }
      return cb(null, res)
    })
  })
}
