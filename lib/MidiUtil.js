'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var logger = require('./logger').createLogger('MidiUtil');
var c = require('chalk');
var midi = require('easymidi');

var _inputs = [];
var _outputs = [];

/**
 * Static-only class wrapping node-easymidi (future proofing)
 */

var MidiUtil = (function () {
  function MidiUtil() {
    _classCallCheck(this, MidiUtil);
  }

  _createClass(MidiUtil, null, [{
    key: 'makeNote',
    value: function makeNote(channel, note) {
      var velocity = arguments.length <= 2 || arguments[2] === undefined ? 127 : arguments[2];

      return { channel: channel, note: note, velocity: velocity };
    }
  }, {
    key: 'makeNoteOn',
    value: function makeNoteOn(channel, note) {
      return MidiUtil.makeNote(channel, note);
    }
  }, {
    key: 'makeNoteOff',
    value: function makeNoteOff(channel, note) {
      return MidiUtil.makeNote(channel, note, 0);
    }
  }, {
    key: 'makeControlChange',
    value: function makeControlChange(channel, controller) {
      var value = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      return { channel: channel, controller: controller, value: value };
    }
  }, {
    key: 'getInputs',
    value: function getInputs() {
      return midi.getInputs();
    }
  }, {
    key: 'getOutputs',
    value: function getOutputs() {
      return midi.getOutputs();
    }
  }, {
    key: 'openInput',
    value: function openInput(name) {
      var input = new midi.Input(name);
      _inputs.push(input);
      return input;
    }
  }, {
    key: 'openOutput',
    value: function openOutput(name) {
      var output = new midi.Output(name);
      _outputs.push(output);
      return output;
    }
  }, {
    key: 'closeAll',
    value: function closeAll() {
      _inputs.forEach(function (x) {
        return x.close();
      });
      _outputs.forEach(function (x) {
        return x.close();
      });
    }
  }, {
    key: 'match',
    value: function match(which, regexp) {
      var number = undefined,
          name = undefined;
      var method = which === 'input' ? 'getInputs' : 'getOutputs';
      MidiUtil[method]().some(function (p, i) {
        if (regexp.test(p.toLowerCase())) {
          var _ref;

          return (_ref = [i, p], number = _ref[0], name = _ref[1], _ref);
        }
      });
      if (!name) {
        logger.error(c.red('Could not find a port to match ') + c.cyan(regexp));
      }
      return [number, name];
    }
  }]);

  return MidiUtil;
})();

module.exports = MidiUtil;
