'use strict'

const getTopicHeading = require('./get-topic-heading')
const getHeadingId = require('./get-heading-id')
const flatten = require('./flatten')

module.exports = function validate (data) {
  // get all topic IDs
  const topicIds = data.topics.map(topic => {
    return getTopicHeading(topic)
  }).map(getHeadingId)

  function isBrokenLink (link) {
    const linkId = getHeadingId(link.identifier)
    return (topicIds.indexOf(linkId) === -1)
  }

  function getLinksWithSrc (src) {
    return src.links.map(link => {
      return {
        src: src,
        link: link
      }
    })
  }

  // get all links and filter out the broken ones
  const noteLinks = data.notes.map(getLinksWithSrc)
  const topicLinks = data.topics.map(getLinksWithSrc)
  const allLinks = flatten(noteLinks.concat(topicLinks))
  const brokenLinks = allLinks.filter(item => isBrokenLink(item.link))

  return brokenLinks.map(item => {
    const src = item.src
    const link = item.link
    const line = link.position.start.line

    const err = new Error(`Broken link to '${link.identifier}' in ${src.filename}:${line}`)
    err.identifier = link.identifier
    err.filename = src.filename
    err.line = line

    return err
  })
}
