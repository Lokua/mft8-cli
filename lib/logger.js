'use strict';

var Logger = require('lo66er');
var _ = require('lodash');

var levels = {
  app: Logger.LOG,
  Bank: Logger.LOG,
  cli: Logger.LOG,
  Encoder: Logger.LOG,
  MidiUtil: Logger.LOG,
  helper: Logger.LOG
};

var _options = {
  outputSource: false,
  useAbsoluteSource: true
};

function createLogger(name, options) {
  return new Logger(name, levels[name]).setOptions(_.merge({}, _options, options));
}

module.exports = { createLogger: createLogger };
