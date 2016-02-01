'use strict'

const format = require('util').format;
const fs = require('fs');
const h = require('hyperscript');
const html = require('remark-html')
const path = require('path');
const remark = require('remark')

const getHeadingId = require('./get-heading-id')
const getTopicFilename = require('./get-topic-filename')

function getHeadingText (node) {
  return node.children[0].value
}

function renderContent (section, linkDefs) {
  var tokens = section.tokens;

  var topicHeading = getHeadingText(section.heading)
  var topicId = getHeadingId(topicHeading);

  const children = [section.heading].concat(section.nodes).concat(linkDefs)
  return remark.use(html).process(remark.stringify({
    type: 'root',
    children: children
  }))
}

function createSectionElem (section, linkDefs) {
  const heading = getHeadingText(section.heading)
  const headingId = getHeadingId(heading);

  const contentElem = h('div.topic-content');
  contentElem.innerHTML = renderContent(section, linkDefs);

  return h('div.topic', [
    contentElem
  ]);
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
    var elem = createSectionElem(section, linkDefs);
    return elem.outerHTML;
  }).join('\n');
}

module.exports = render;
