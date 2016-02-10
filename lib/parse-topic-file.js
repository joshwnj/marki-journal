'use strict'

const remark = require('remark')
const walkMdAst = require('./walk-md-ast')

module.exports = function parseTopic (raw, cb) {
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

  // must be at least 1 section (otherwise there's no way to link to the topic)
  if (sections.length < 1) {
    return cb(new Error('Topic must have at least 1 section'))
  }

  // walk the entire tree to find wikilinks
  walkMdAst(root, function visit (node) {
    switch (node.type) {
    case 'linkReference':
      links.push(node)
      break
    }
  }, function end () {
    return cb(null, {
      sections: sections,
      links: links
    })
  })
}
