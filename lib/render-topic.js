'use strict'

const h = require('hyperscript')
const html = require('remark-html')
const path = require('path')
const remark = require('remark')

const normalizeTopicId = require('./normalize-topic-id')
const getTopicHeading = require('./get-topic-heading')
const getTopicFilenameFromHeading = require('./get-topic-filename-from-heading')

function renderContent (section, linkDefs) {
  const children = [section.heading].concat(section.nodes).concat(linkDefs)
  return remark.use(html).process(remark.stringify({
    type: 'root',
    children: children
  }))
}

function renderIncomingLinks (topic, objects) {
  const selfHeadingId = normalizeTopicId(getTopicHeading(topic))
  const isIncomingLink = (link) => {
    return selfHeadingId === normalizeTopicId(link.identifier)
  }

  const linkedNotes = objects.notes.filter(note => {
    return note.links.some(isIncomingLink)
  })

  const linkedTopics = objects.topics.filter(topic => {
    return topic.links.some(isIncomingLink)
  })

  const renderNoteLink = note => {
    const filename = path.basename(note.filename).replace(/\.md$/, '.html')
    return h('li', h('a', {
      href: '../notes/' + filename
    }, 'notes/' + filename))
  }

  const renderTopicLink = topic => {
    const filename = path.basename(topic.filename).replace(/\.md$/, '.html')
    const heading = getTopicHeading(topic)
    return h('li', h('a', {
      href: './' + filename
    }, heading))
  }

  // don't display the "Incoming Links" section if nothing has linked to this topic
  if (linkedNotes.length + linkedTopics.length === 0) { return null }

  return h('div.incoming-links', [
    h('h2', 'Incoming Links'),
    h('ul', [
      linkedNotes.map(renderNoteLink),
      linkedTopics.map(renderTopicLink)
    ])
  ])
}

function createSectionElem (section, linkDefs) {
  const contentElem = h('div.section-content')
  contentElem.innerHTML = renderContent(section, linkDefs)

  return h('section', [
    contentElem
  ])
}

function render (topic, objects) {
  const linkDefs = topic.links.map(node => {
    const identifier = node.identifier
    return {
      type: 'definition',
      identifier: identifier,
      link: getTopicFilenameFromHeading(identifier)
    }
  })

  const sectionNodes = topic.sections.map(section => createSectionElem(section, linkDefs))
  return h('div.topic', [
    sectionNodes,
    renderIncomingLinks(topic, objects)
  ]).outerHTML
}

module.exports = render
