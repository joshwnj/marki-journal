'use strict'

const flatten = require('./flatten')
const isValidLink = require('./is-valid-link')

function getLinksWithSrc (src) {
  return src.links.map(link => {
    return {
      src: src,
      link: link
    }
  })
}

module.exports = function validate (data) {
  // get all links and filter out the broken ones
  const noteLinks = data.notes.map(getLinksWithSrc)
  const topicLinks = data.topics.map(getLinksWithSrc)
  const allLinks = flatten(noteLinks.concat(topicLinks))
  const brokenLinks = allLinks.filter(item => !isValidLink(item.link, data.topics))

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
