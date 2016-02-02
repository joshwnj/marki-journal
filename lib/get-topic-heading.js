'use strict'

module.exports = function getTopicHeading (topic) {
  return topic.sections[0].heading.children[0].value
}
