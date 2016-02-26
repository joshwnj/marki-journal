'use strict'

const path = require('path')

const build = require('./build')

const journalDir = process.cwd()
const srcDir = path.join(journalDir, 'src')
const srcTopicsDir = path.join(srcDir, 'docs')

const distDir = path.join(journalDir, 'dist')
const distTopicsDir = path.join(distDir, 'topics')

const opts = {
  srcTopicsDir: srcTopicsDir,
  distTopicsDir: distTopicsDir
}

build(opts, err => {
  if (err) {
    switch (err.message) {
      case 'validation errors':
        console.error('[ERR] %s', err.message)
        err.errors.forEach(err => console.error('- %s', err.message))
        break

      default:
        throw err
    }
    process.exit(1)
  }

  console.log('ok')
})
