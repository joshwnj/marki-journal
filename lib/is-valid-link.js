'use strict'

const getLinkParts = require('./get-link-parts')
const getTopicHeading = require('./get-topic-heading')
const normalizeTopicId = require('./normalize-topic-id')

module.exports = function isValidLink (link, topics) {
  const linkParts = getLinkParts(link.identifier)

  let topic = null
  topics.some((t) => {
    const heading = normalizeTopicId(getTopicHeading(t))

    // h1 doesn't match
    if (linkParts[0] !== heading) { return false }

    topic = t
    return true
  })

  // topic not found
  if (!topic) { return false }

  // if there is only 1 segment in the link, we've got a match
  if (linkParts.length === 1) {
    return true
  }

  for (let i = 1; i < topic.sections.length; i += 1) {
    // found a subheading match
    if (linkParts[1] === normalizeTopicId(getTopicHeading(topic, i))) { return true }
  }

  // no subheading match
  return false
}
