'use strict';

const logger = require('./logger').createLogger('app');
const c = require('chalk');
const _ = require('tooly').extendTo(require('lodash'));
const path = require('path');
const fs = require('fs');
const Bank = require('./Bank');
const Twister = require('./Twister');
const MidiUtil = require('./MidiUtil');
const helper = require('./helper');

/* requiring automatically runs the cli client */
let config = require('./cli')(process.argv.slice(2));

if (config === 'exit') {
  process.exit(0);
}

if (config === 'auto') {
  config = require('../conf/auto-config.json');
}

let colors;
if (config.colors && _.type(config.colors, 'string')) {
  colors = JSON.parse(fs.readFileSync(config.colors), 'utf8');
}

let bankInputConfig = {};
if (config.hasOwnProperty('bankInput')) {
  bankInputConfig = config.bankInput;
} else {
  bankInputConfig = {
    channel: 3,
    notes: [0,1,2,3,4,5,6,7]
  }
}

run(config);

function run(config) {

  const twister = new Twister([createGroup(), createGroup(4)], 0, 0, colors);

  const [inputNumber, inputName] =
    MidiUtil.match('input', new RegExp(config.input, 'i'));

  const [outputNumber, outputName] =
    MidiUtil.match('output', new RegExp(config.output, 'i'));

  const [virtualInNumber, virtualInName] =
    MidiUtil.match('input', new RegExp(config.virtualIn, 'i'));

  const [virtualOutNumber, virtualOutName] =
    MidiUtil.match('output', new RegExp(config.virtualOut, 'i'));


  const input = MidiUtil.openInput(inputName);
  const output = MidiUtil.openOutput(outputName);
  const virtualIn = MidiUtil.openInput(virtualInName);
  const virtualOut = MidiUtil.openOutput(virtualOutName);


  welcome();

  /* LIGHT SHOW! */
  // flashOff();
  // flash();


  /* MESSAGING */

  input.on('cc', msg => {
    debug('cc', msg, 'input');
    if (msg.channel > 1) return;

    /* If we are in banks 4-7, add 64 to the controller number */
    const controller = msg.controller + (twister.getActiveGroupIndex() ? 64 : 0);
    virtualOut.send('cc', MidiUtil.makeControlChange(msg.channel, controller, msg.value));

    /* Override Twister with our custom color */
    const color = twister.getColor(null, msg.channel, msg.controller);
    output.send('cc', MidiUtil.makeControlChange(1, msg.controller, color));

    /* cache the controller value */
    twister.getActiveBank().setEncoderFromMessage(msg);
  });

  /* Shift encoder up to channel 1 */
  input.on('noteon', msg => {
    debug('noteon', msg, 'input');
    virtualOut.send('noteon', msg);
    if (msg.channel === 0) {
      const color = twister.getColor(null, 1, msg.note);
      output.send('cc', MidiUtil.makeControlChange(1, msg.note, color));
    }
  });

  /* Shift encoder back down to channel 0 */
  input.on('noteoff', msg => {
    debug('noteoff', msg, 'input');
    virtualOut.send('noteoff', msg, 'input.on noteoff');
    if (msg.channel === 0) {
      const color = twister.getColor(null, 0, msg.note);
      output.send('cc', MidiUtil.makeControlChange(1, msg.note, color));
    }
  });


  /* Incoming bank changes */
  virtualIn.on('noteon', msg => {
    debug('noteon', msg, 'virtualIn');

    logger.debug('bankInputConfig.channel: %o', bankInputConfig.channel);

    // get channel from config/default
    if (msg.channel === bankInputConfig.channel) {
      const n = msg.note;
      const isGroup0 = n < 4;

      /* Exec the real 0-3 bank change */
      output.send('noteon', MidiUtil.makeNoteOn(3, isGroup0 ? n : n-4));

      twister
        .setActiveGroupIndex(isGroup0 ? 0 : 1)
        .setActiveBankIndex(isGroup0 ? n : n-4);

      const bank = twister.getActiveBank();

      for (let i = 0; i < 16; i++) {

        const controller = ((n % 4)*16)+i;

        let color = twister.getColor(null,
            bank.getActiveChannelForController(controller),
            controller);

        /* set color */
        output.send('cc', MidiUtil.makeControlChange(1, controller, color));

        /* set ring */
        const value = bank.getActiveValueForController(controller);
        output.send('cc', MidiUtil.makeControlChange(0, controller, value));
      }
    }
  });

  process.on('SIGINT', () => {
    MidiUtil.closeAll();
    logger.info(c.green('Bye!'));
    process.exit(0);
  });


  /* INITIALIZATION &| HELPERS */

  function createGroup() {
    let banks = [];
    for (let i = 0; i < 4; i++) {
      banks[i] = new Bank(i);
      banks[i].init();
    }
    return banks;
  }

  function welcome() {
    logger.info('%s %s %s', c.green(inputName),
      c.yellow('receiving on port '), c.green(inputNumber));
    logger.info('%s %s %s', c.green(outputName),
      c.yellow('sending on port '), c.green(outputNumber));
    logger.info('%s %s %s', c.green(virtualInName),
      c.yellow('forwarding in on port '), c.green(virtualInNumber));
    logger.info('%s %s %s', c.green(virtualOutName),
      c.yellow('forwarding out on port '), c.green(virtualOutNumber));
  }

  function flashOff() {
    output.send('noteon', MidiUtil.makeNoteOn(3, 0));
    for (let i = 0; i < 16; i++) {
      helper.sleep(50, () => {
        output.send('cc', MidiUtil.makeControlChange(1, i, 0));
      });
    }
  }

  function flash() {
    output.send('noteon', MidiUtil.makeNoteOn(3, 0));
    for (let i = 0; i < 16; i++) {
      helper.sleep(50, () => {
        const m = MidiUtil.makeControlChange(1, i, twister.getColor(0, 0, i));
        output.send('cc', MidiUtil.makeControlChange(1, i, twister.getColor(0, 0, i)));
      });
    }
  }

  function debug(type, msg, port='?') {
    const m = Object
      .keys(msg)
      .map(k => `${k}: ${c.green(msg[k])}`)
      .join(', ');
    logger.debug('port: %s, type: %s, %s', c.cyan(port), c.green(type), m);
  }
}
