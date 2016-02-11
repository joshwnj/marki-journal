'use strict'

const autolink = require('remark-autolink-headings')
const h = require('hyperscript')
const html = require('remark-html')
const path = require('path')
const remark = require('remark')
const slug = require('remark-slug')

const normalizeTopicId = require('./normalize-topic-id')
const getTopicFilename = require('./get-topic-filename')
const getTopicHeading = require('./get-topic-heading')
const getLinkHref = require('./get-link-href')

function renderContent (section, linkDefs) {
  const children = [section.heading].concat(section.nodes).concat(linkDefs)
  return remark
    .use([
      // note: `autolink` needs to go _after_ `slug`,
      // otherwise it won't know where to link to
      slug,
      autolink,
      html
    ])
    .process(remark.stringify({
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
    const href = getTopicFilename(topic)
    const heading = getTopicHeading(topic)
    return h('li', h('a', {
      href: href
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
      link: getLinkHref(node)
    }
  })

  const sectionNodes = topic.sections.map(section => createSectionElem(section, linkDefs))
  return h('div.topic', [
    sectionNodes,
    renderIncomingLinks(topic, objects)
  ]).outerHTML
}

module.exports = render
