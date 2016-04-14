'use strict'

const autolink = require('remark-autolink-headings')
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
      autolink
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

  const linkedNotes = objects.notes.filter((note) => {
    return note.links.some(isIncomingLink)
  })

  const linkedTopics = objects.topics.filter((topic) => {
    return topic.links.some(isIncomingLink)
  })

  const renderNoteLink = (note) => {
    const filename = path.basename(note.filename)
    const href = `../notes/${filename}`
    const text = `notes/${filename}`
    return `- [${text}](${href})`
  }

  const renderTopicLink = (topic) => {
    const href = getTopicFilename(topic, 'md')
    const text = getTopicHeading(topic)
    return `- [${text}](${href})`
  }

  // don't display the "Incoming Links" section if nothing has linked to this topic
  if (linkedNotes.length + linkedTopics.length === 0) { return '' }

  return `
## Referenced from:

${linkedNotes.map(renderNoteLink).join('\n')}
${linkedTopics.map(renderTopicLink).join('\n')}
`
}

function createSectionElem (section, linkDefs) {
  return renderContent(section, linkDefs)
}

function render (topic, objects) {
  const linkDefs = topic.links.map((node) => {
    const identifier = node.identifier
    return {
      type: 'definition',
      identifier: identifier,
      url: getLinkHref(node, 'md')
    }
  })

  const sectionNodes = topic.sections.map((section) => createSectionElem(section, linkDefs))
  return sectionNodes.join('\n') + renderIncomingLinks(topic, objects)
}

module.exports = render
