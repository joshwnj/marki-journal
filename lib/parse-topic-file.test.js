'use strict'

const tape = require('tape')
const parseTopicFile = require('./parse-topic-file')

tape('parse-topic-file', (t) => {
  t.test('parse a valid topic', (t) => {
    const raw = `
# here is h1

and some content

## and here is h2

and more content with links:

- [A][]
- [B][]
- [C][]
`

    t.plan(2)
    parseTopicFile(raw, (err, res) => {
      if (err) { throw err }

      t.equal(res.sections.length, 2, 'one section per heading')
      t.equal(res.links.length, 3, 'found links')
    })
  })

  t.test('parse an invalid topic (no headings)', (t) => {
    const raw = `
topic with no headings
`
    t.plan(1)
    parseTopicFile(raw, (err, res) => {
      t.equal(err.message, 'Topic must have at least 1 section', 'received correct error')
    })
  })
})

