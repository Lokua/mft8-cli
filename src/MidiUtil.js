
const logger = require('./logger').createLogger('MidiUtil');
const c = require('chalk');
const midi = require('easymidi');

const _inputs = [];
const _outputs = [];

/**
 * Static-only class wrapping node-easymidi (future proofing)
 */
class MidiUtil {

  static makeNote(channel, note, velocity=127) {
    return { channel, note, velocity };
  }

  static makeNoteOn(channel, note) {
    return MidiUtil.makeNote(channel, note);
  }

  static makeNoteOff(channel, note) {
    return MidiUtil.makeNote(channel, note, 0);
  }

  static makeControlChange(channel, controller, value=0) {
    return { channel, controller, value };
  }

  static getInputs() {
    return midi.getInputs();
  }

  static getOutputs() {
    return midi.getOutputs();
  }

  static openInput(name) {
    const input = new midi.Input(name);
    _inputs.push(input);
    return input;
  }

  static openOutput(name) {
    const output = new midi.Output(name);
    _outputs.push(output);
    return output;
  }

  static closeAll() {
    _inputs.forEach(x => x.close());
    _outputs.forEach(x => x.close());
  }

  static match(which, regexp) {
    let number, name;
    const method = which === 'input' ? 'getInputs' : 'getOutputs';
    MidiUtil[method]().some((p, i) => {
      if (regexp.test(p.toLowerCase())) {
        return ([number, name] = [i, p]);
      }
    });
    if (!name) {
      logger.error(c.red('Could not find a port to match ') + c.cyan(regexp));
    }
    return [number, name];
  }
}

module.exports = MidiUtil;
