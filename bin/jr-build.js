#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const path = require('path')

const build = require('../build')

const argv = minimist(process.argv.slice(2))

// docs mode
const topicsDir = argv.docs || argv.d
const outDir = argv.out || argv.o
if (topicsDir) {
  if (!outDir) {
    console.error('Output dir (-o, --out) is required in docs mode')
    process.exit(1)
  }

  const opts = {
    srcTopicsDir: topicsDir,
    distTopicsDir: outDir,
    format: 'md'
  }

  build(opts, handleResult)
} else { // journal mode
  const journalDir = process.argv[2] || process.cwd()
  const srcDir = path.join(journalDir, 'src')
  const srcTopicsDir = path.join(srcDir, 'topics')
  const srcNotesDir = path.join(srcDir, 'notes')

  const distDir = path.join(journalDir, 'dist')
  const distTopicsDir = path.join(distDir, 'topics')
  const distNotesDir = path.join(distDir, 'notes')

  const opts = {
    srcTopicsDir: srcTopicsDir,
    srcNotesDir: srcNotesDir,
    distTopicsDir: distTopicsDir,
    distNotesDir: distNotesDir,
    format: 'html'
  }

  build(opts, handleResult)
}

function handleResult (err) {
  if (err) {
    switch (err.message) {
      case 'validation errors':
        console.error('[ERR] %s', err.message)
        err.errors.forEach((err) => console.error('- %s', err.message))
        break

      default:
        throw err
    }
    process.exit(1)
  }

  console.log('ok')
}
