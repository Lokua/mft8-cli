
const logger = require('./logger').createLogger('Bank');

const Encoder = require('./Encoder');
const [BANK_N, ENCODERS] = [Symbol(), Symbol()];

class Bank {

  /**
   * A structure representing a bank of 16 Encoder instances.
   *
   * @constructor
   * @param  {Number} bankIndex  the bank number, zero indexed.
   */
  constructor(bankIndex) {
    this[BANK_N] = bankIndex;
    this[ENCODERS] = new Map();
    return this;
  }

  /**
   * Set all CC values of this bank to 0
   *
   * @return {this}
   */
  init() {
    for (let i = 0; i < 16; i++) {
      const controller = ((this[BANK_N])*16)+i;
      this[ENCODERS].set(controller, new Encoder(0, [0, 0]));
    }
    return this;
  }

  /**
   * @param  {Number} channel    the channel number (0-1)
   * @param  {Number} controller the controller number
   * @return {Number} the controller value
   */
  getValue(channel, controller) {
    return this[ENCODERS].get(controller).getValue(channel);
  }

  getActiveChannelForController(controller) {
    return this[ENCODERS].get(controller).getChannel();
  }

  getActiveValueForController(controller) {
    const encoder = this[ENCODERS].get(controller);
    return encoder.getValue(encoder.getChannel());
  }

  setEncoderFromMessage(msg) {
    const controller = msg[msg.hasOwnProperty('note') ? 'note' : 'controller'];
    if (!this.hasController(controller)) {
      throw new Error(`${controller} is not in bank ${this[BANK_N]}`);
    }
    const encoder = this[ENCODERS].get(controller);
    // TODO: what about velocity?
    encoder
      .setChannel(msg.channel)
      .setValue(msg.channel, msg.value);
    return this;
  }

  /**
   * Check whether @controller is in this bank
   *
   * @param  {Number}  controller the controller to validate
   * @return {Boolean} true if controller is in this bank
   */
  hasController(controller) {
    return this[ENCODERS].has(controller);
  }

}

module.exports = Bank;
