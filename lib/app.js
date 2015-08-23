'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var logger = require('./logger').createLogger('app');
var c = require('chalk');
var _ = require('tooly').extendTo(require('lodash'));
var path = require('path');
var fs = require('fs');
var Bank = require('./Bank');
var Twister = require('./Twister');
var MidiUtil = require('./MidiUtil');
var helper = require('./helper');

/* requiring automatically runs the cli client */
var config = require('./cli')(process.argv.slice(2));

if (config === 'exit') {
  process.exit(0);
}

if (config === 'auto') {
  config = require('../conf/auto-config.json');
}

var colors = undefined;
if (config.colors && _.type(config.colors, 'string')) {
  colors = JSON.parse(fs.readFileSync(config.colors), 'utf8');
}

var bankInputConfig = {};
if (config.hasOwnProperty('bankInput')) {
  bankInputConfig = config.bankInput;
} else {
  bankInputConfig = {
    channel: 3,
    notes: [0, 1, 2, 3, 4, 5, 6, 7]
  };
}

run(config);

function run(config) {

  var twister = new Twister([createGroup(), createGroup(4)], 0, 0, colors);

  var _MidiUtil$match = MidiUtil.match('input', new RegExp(config.input, 'i'));

  var _MidiUtil$match2 = _slicedToArray(_MidiUtil$match, 2);

  var inputNumber = _MidiUtil$match2[0];
  var inputName = _MidiUtil$match2[1];

  var _MidiUtil$match3 = MidiUtil.match('output', new RegExp(config.output, 'i'));

  var _MidiUtil$match32 = _slicedToArray(_MidiUtil$match3, 2);

  var outputNumber = _MidiUtil$match32[0];
  var outputName = _MidiUtil$match32[1];

  var _MidiUtil$match4 = MidiUtil.match('input', new RegExp(config.virtualIn, 'i'));

  var _MidiUtil$match42 = _slicedToArray(_MidiUtil$match4, 2);

  var virtualInNumber = _MidiUtil$match42[0];
  var virtualInName = _MidiUtil$match42[1];

  var _MidiUtil$match5 = MidiUtil.match('output', new RegExp(config.virtualOut, 'i'));

  var _MidiUtil$match52 = _slicedToArray(_MidiUtil$match5, 2);

  var virtualOutNumber = _MidiUtil$match52[0];
  var virtualOutName = _MidiUtil$match52[1];

  var input = MidiUtil.openInput(inputName);
  var output = MidiUtil.openOutput(outputName);
  var virtualIn = MidiUtil.openInput(virtualInName);
  var virtualOut = MidiUtil.openOutput(virtualOutName);

  welcome();

  /* LIGHT SHOW! */
  // flashOff();
  // flash();

  /* MESSAGING */

  input.on('cc', function (msg) {
    debug('cc', msg, 'input');
    if (msg.channel > 1) return;

    /* If we are in banks 4-7, add 64 to the controller number */
    var controller = msg.controller + (twister.getActiveGroupIndex() ? 64 : 0);
    virtualOut.send('cc', MidiUtil.makeControlChange(msg.channel, controller, msg.value));

    /* Override Twister with our custom color */
    var color = twister.getColor(null, msg.channel, msg.controller);
    output.send('cc', MidiUtil.makeControlChange(1, msg.controller, color));

    /* cache the controller value */
    twister.getActiveBank().setEncoderFromMessage(msg);
  });

  /* Shift encoder up to channel 1 */
  input.on('noteon', function (msg) {
    debug('noteon', msg, 'input');
    virtualOut.send('noteon', msg);
    if (msg.channel === 0) {
      var color = twister.getColor(null, 1, msg.note);
      output.send('cc', MidiUtil.makeControlChange(1, msg.note, color));
    }
  });

  /* Shift encoder back down to channel 0 */
  input.on('noteoff', function (msg) {
    debug('noteoff', msg, 'input');
    virtualOut.send('noteoff', msg, 'input.on noteoff');
    if (msg.channel === 0) {
      var color = twister.getColor(null, 0, msg.note);
      output.send('cc', MidiUtil.makeControlChange(1, msg.note, color));
    }
  });

  /* Incoming bank changes */
  virtualIn.on('noteon', function (msg) {
    debug('noteon', msg, 'virtualIn');

    logger.debug('bankInputConfig.channel: %o', bankInputConfig.channel);

    // get channel from config/default
    if (msg.channel === bankInputConfig.channel) {
      var n = msg.note;
      var isGroup0 = n < 4;

      /* Exec the real 0-3 bank change */
      output.send('noteon', MidiUtil.makeNoteOn(3, isGroup0 ? n : n - 4));

      twister.setActiveGroupIndex(isGroup0 ? 0 : 1).setActiveBankIndex(isGroup0 ? n : n - 4);

      var bank = twister.getActiveBank();

      for (var i = 0; i < 16; i++) {

        var controller = n % 4 * 16 + i;

        var color = twister.getColor(null, bank.getActiveChannelForController(controller), controller);

        /* set color */
        output.send('cc', MidiUtil.makeControlChange(1, controller, color));

        /* set ring */
        var value = bank.getActiveValueForController(controller);
        output.send('cc', MidiUtil.makeControlChange(0, controller, value));
      }
    }
  });

  process.on('SIGINT', function () {
    MidiUtil.closeAll();
    logger.info(c.green('Bye!'));
    process.exit(0);
  });

  /* INITIALIZATION &| HELPERS */

  function createGroup() {
    var banks = [];
    for (var i = 0; i < 4; i++) {
      banks[i] = new Bank(i);
      banks[i].init();
    }
    return banks;
  }

  function welcome() {
    logger.info('%s %s %s', c.green(inputName), c.yellow('receiving on port '), c.green(inputNumber));
    logger.info('%s %s %s', c.green(outputName), c.yellow('sending on port '), c.green(outputNumber));
    logger.info('%s %s %s', c.green(virtualInName), c.yellow('forwarding in on port '), c.green(virtualInNumber));
    logger.info('%s %s %s', c.green(virtualOutName), c.yellow('forwarding out on port '), c.green(virtualOutNumber));
  }

  function flashOff() {
    output.send('noteon', MidiUtil.makeNoteOn(3, 0));

    var _loop = function (i) {
      sleep(50, function () {
        output.send('cc', MidiUtil.makeControlChange(1, i, 0));
      });
    };

    for (var i = 0; i < 16; i++) {
      _loop(i);
    }
  }

  function flash() {
    output.send('noteon', MidiUtil.makeNoteOn(3, 0));

    var _loop2 = function (i) {
      sleep(50, function () {
        var m = MidiUtil.makeControlChange(1, i, twister.getColor(0, 0, i));
        output.send('cc', MidiUtil.makeControlChange(1, i, twister.getColor(0, 0, i)));
      });
    };

    for (var i = 0; i < 16; i++) {
      _loop2(i);
    }
  }

  function sleep(time, fn) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {}
    fn();
  }

  function debug(type, msg) {
    var port = arguments.length <= 2 || arguments[2] === undefined ? '?' : arguments[2];

    var m = Object.keys(msg).map(function (k) {
      return k + ': ' + c.green(msg[k]);
    }).join(', ');
    logger.debug('port: %s, type: %s, %s', c.cyan(port), c.green(type), m);
  }
}
