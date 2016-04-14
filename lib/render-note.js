'use strict'

const h = require('hyperscript')
const html = require('remark-html')
const remark = require('remark')

const getTopicFilenameFromHeading = require('./get-topic-filename-from-heading')

function renderContent (note) {
  const linkDefs = note.links.map((node) => {
    const identifier = node.identifier
    return {
      type: 'definition',
      identifier: identifier,
      link: `../topics/${getTopicFilenameFromHeading(identifier)}`
    }
  })

  const children = note.nodes.concat(linkDefs)
  return remark.use(html).process(remark.stringify({
    type: 'root',
    children: children
  }))
}

function createNoteElem (note) {
  const contentElem = h('div.note-content')
  contentElem.innerHTML = renderContent(note)

  return h('div.note', [
    contentElem
  ])
}

function render (note) {
  const elem = createNoteElem(note)
  return elem.outerHTML
}

module.exports = render
