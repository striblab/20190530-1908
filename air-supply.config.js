const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { argv } = require('yargs');

module.exports = {
  // Default cache
  ttl: 1000 * 60 * 60 * 24,
  // Cache path
  cachePath: '.cache-air-supply',
  // Allow --no-cache to turn off caching
  noCache: argv.cache === false,
  // Datasets
  packages: {
    // Pull in config
    config: 'config.json',
    // Pull in content data
    content: 'content.json',
    argv: {
      source: argv,
      type: 'data'
    },
    publishYear: {
      source: publishYear,
      type: 'data'
    },
    points: {
     ttl: 1000 * 60,
     source:
       'https://docs.google.com/spreadsheets/d/e/2PACX-1vTGanK8eLYrwlRUc26NWbgsbGtUlYpDdRXB5QYRkBmlMChr4FXcLYCK3vHFHMZddfvav7BGxXkRjj2O/pub?output=csv',
     output: 'assets/data/poi.json'
   }
 };
