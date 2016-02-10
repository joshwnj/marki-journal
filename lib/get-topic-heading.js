'use strict'

module.exports = function getTopicHeading (topic, sectionIndex) {
  sectionIndex = sectionIndex || 0
  return topic.sections[sectionIndex].heading.children[0].value
}
