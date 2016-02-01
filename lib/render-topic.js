'use strict'

const h = require('hyperscript')
const html = require('remark-html')
const remark = require('remark')

const getTopicFilename = require('./get-topic-filename')

function renderContent (section, linkDefs) {
  const children = [section.heading].concat(section.nodes).concat(linkDefs)
  return remark.use(html).process(remark.stringify({
    type: 'root',
    children: children
  }))
}

function createSectionElem (section, linkDefs) {
  const contentElem = h('div.topic-content')
  contentElem.innerHTML = renderContent(section, linkDefs)

  return h('div.topic', [
    contentElem
  ])
}

function render (topic) {
  const linkDefs = topic.links.map(node => {
    const identifier = node.identifier
    return {
      type: 'definition',
      identifier: identifier,
      link: getTopicFilename(identifier)
    }
  })

  return topic.sections.map(function (section) {
    const elem = createSectionElem(section, linkDefs)
    return elem.outerHTML
  }).join('\n')
}

module.exports = render
