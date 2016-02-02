#!/usr/bin/env node
'use strict'

const path = require('path')

const build = require('../build')

const journalDir = process.cwd()
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
  distNotesDir: distNotesDir
}

build(opts, err => {
  if (err) { throw err }

  console.log('ok')
})
