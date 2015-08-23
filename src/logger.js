
const Logger = require('lo66er');
const _ = require('lodash');

const levels = {
  app: Logger.LOG,
  Bank: Logger.LOG,
  cli: Logger.LOG,
  Encoder: Logger.LOG,
  MidiUtil: Logger.LOG,
  helper: Logger.LOG
};

const _options = {
  outputSource: false,
  useAbsoluteSource: true
};

function createLogger(name, options) {
  return new Logger(name, levels[name])
    .setOptions(_.merge({}, _options, options));
}

module.exports = { createLogger };
