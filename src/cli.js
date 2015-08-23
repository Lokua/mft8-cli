'use strict';

const logger = require('./logger').createLogger('cli');
const c = require('chalk');
const prompt = require('synchro-prompt');
const fs = require('fs');
const path = require('path');
const MidiUtil = require('./MidiUtil');
const tooly = require('tooly');


const argv = process.argv.slice(2);
if (/-d|--debug/.test(argv[0])) {
  module.exports = parseArgs(argv.slice(1));
}

// const cli = parseArgs(process.argv.slice(2));
module.exports = parseArgs;

function parseArgs(args) {
  switch (args[0]) {

    case 'help': case '--help': case '-h':
      return help();

    case 'version': case '--version': case '-v':
      const pkg = require(path.resolve(__dirname, '../../package.json'));
      return console.log(c.green(pkg.version));

    case 'auto':
      return 'auto';

    case 'list':
      return list();

    case '--config': case '-c':
      return config(args);

    case '--ports': case '-p':
      return parsePortOption(args);

    case '--interactive': case '-i':
      return setPortsInteractively();
  }
}

function help() {
  const fpath = path.resolve(__dirname, 'usage.txt');
  fs.readFile(fpath, 'utf8', function(err, text) {
    if (err) throw err;
    // TODO: make me pretty
    console.log(text);
  });
  return 'exit';
}

function list() {

  console.log(c.yellow('\nInputs'));
  MidiUtil.getInputs().forEach((x, i) => console.log('\t%s: %s', c.green(i), x));

  console.log(c.yellow('\nOutputs'));
  MidiUtil.getOutputs().forEach((x, i) => console.log('\t%s: %s', c.green(i), x));

  console.log('\n' + c.green('Bye!'));

  return 'exit';
}

function config(args) {
  let conf;
  try {
    conf = JSON.parse(fs.readFileSync(args[1], 'utf8'));
  } catch (err) {
    logger.error(args[1] + ' is not a valid json file.\n' +
      'Make sure your json is valid and that you are using an absolute path!');
    logger.error(err);
  }
  logger.debug('conf: %o', conf);
  return conf;
}

function setPortsInteractively() {
  let input, output, virtualIn, virtualOut;
  let correct = false;
  do {
    const inputs = MidiUtil.getInputs();
    const outputs = MidiUtil.getOutputs();

    console.log(c.yellow('---\nChoose the input port of your MIDI Fighter Twister\n'));
    inputs.forEach((input, number) => console.log('%s: %s', c.green(number), input));
    input = prompt('\nEnter number: ');

    console.log(c.yellow('---\nChoose the output port of your MIDI Fighter Twister\n'));
    outputs.forEach((output, number) => console.log('%s: %s', c.green(number), output));
    output = prompt('\nEnter number: ');

    console.log(c.yellow('---\nChoose a virtual port to send bank changes FROM your DAW\n'));
    inputs.forEach((input, number) => console.log('%s: %s', c.green(number), input));
    virtualIn = prompt('\nEnter number: ');

    console.log(c.yellow('---\nChoose a virtual port to route TO your DAW\n'));
    outputs.forEach((output, number) => console.log('%s: %s', c.green(number), output));
    virtualOut = prompt('\nEnter number: ');

    console.log('\n%s: %s\n%s: %s\n%s: %s\n%s: %s\n',
      c.green(input), inputs[input],
      c.green(output), outputs[output],
      c.green(virtualIn), inputs[virtualIn],
      c.green(virtualOut), outputs[virtualOut]
    );

    // TODO: use y/n lib from awesome-node list?
    correct = prompt(c.yellow('Are these correct? (y/n): ')) === 'y' ? 1 : 0;
  } while (!correct);

  return { input, output, virtualIn, virtualOut };
}

function parsePortOption(args) {
  throw new Error('Sorry! This option has not yet been implemented.');
}
