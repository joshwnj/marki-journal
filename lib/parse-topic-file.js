'use strict'

const fs = require('fs')
const remark = require('remark')

const walkMdAst = require('./walk-md-ast')

module.exports = function parseFile (filename, cb) {
  fs.readFile(filename, 'utf8', function (err, raw) {
    if (err) { return cb(err) }

    const sections = []
    const links = []
    let currentSection

    const root = remark.parse(raw)

    // construct sections from top-level nodes
    root.children.forEach(function (node) {
      var isSectionHeading = (node.type === 'heading')

      // ignore anything that comes before the first section
      if (!currentSection && !isSectionHeading) { return }

      // new section
      if (isSectionHeading) {
        const section = {
          heading: node,
          nodes: []
        }

        currentSection = section
        sections.push(section)
      } else {
        currentSection.nodes.push(node)
      }
    })

    // walk the entire tree to find wikilinks
    walkMdAst(root, function visit (node) {
      switch (node.type) {
        case 'linkReference':
          links.push(node)
          break
      }
    }, function end () {
      return cb(null, {
        filename: filename,
        sections: sections,
        links: links
      })
    })
  })
}
