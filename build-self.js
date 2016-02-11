'use strict'

const path = require('path')

const build = require('./build')

const journalDir = process.cwd()
const srcDir = path.join(journalDir, 'src')
const srcTopicsDir = path.join(srcDir, 'docs')
//const srcNotesDir = path.join(srcDir, 'topics')

const distDir = path.join(journalDir, 'dist')
const distTopicsDir = path.join(distDir, 'topics')
//const distNotesDir = path.join(distDir, 'notes')

const opts = {
  srcTopicsDir: srcTopicsDir,
//  srcNotesDir: srcNotesDir,
  distTopicsDir: distTopicsDir,
//  distNotesDir: distNotesDir
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
