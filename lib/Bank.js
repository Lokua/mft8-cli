'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var logger = require('./logger').createLogger('Bank');

var Encoder = require('./Encoder');
var BANK_N = Symbol();
var ENCODERS = Symbol();

var Bank = (function () {

  /**
   * A structure representing a bank of 16 Encoder instances.
   *
   * @constructor
   * @param  {Number} bankIndex  the bank number, zero indexed.
   */

  function Bank(bankIndex) {
    _classCallCheck(this, Bank);

    this[BANK_N] = bankIndex;
    this[ENCODERS] = new Map();
    return this;
  }

  /**
   * Set all CC values of this bank to 0
   *
   * @return {this}
   */

  _createClass(Bank, [{
    key: 'init',
    value: function init() {
      for (var i = 0; i < 16; i++) {
        var controller = this[BANK_N] * 16 + i;
        this[ENCODERS].set(controller, new Encoder(0, [0, 0]));
      }
      return this;
    }

    /**
     * @param  {Number} channel    the channel number (0-1)
     * @param  {Number} controller the controller number
     * @return {Number} the controller value
     */
  }, {
    key: 'getValue',
    value: function getValue(channel, controller) {
      return this[ENCODERS].get(controller).getValue(channel);
    }
  }, {
    key: 'getActiveChannelForController',
    value: function getActiveChannelForController(controller) {
      return this[ENCODERS].get(controller).getChannel();
    }
  }, {
    key: 'getActiveValueForController',
    value: function getActiveValueForController(controller) {
      var encoder = this[ENCODERS].get(controller);
      return encoder.getValue(encoder.getChannel());
    }
  }, {
    key: 'setEncoderFromMessage',
    value: function setEncoderFromMessage(msg) {
      var controller = msg[msg.hasOwnProperty('note') ? 'note' : 'controller'];
      if (!this.hasController(controller)) {
        throw new Error(controller + ' is not in bank ' + this[BANK_N]);
      }
      var encoder = this[ENCODERS].get(controller);
      encoder.setChannel(msg.channel).setValue(msg.channel, msg.value);
      return this;
    }

    /**
     * Check whether @controller is in this bank
     *
     * @param  {Number}  controller the controller to validate
     * @return {Boolean} true if controller is in this bank
     */
  }, {
    key: 'hasController',
    value: function hasController(controller) {
      return this[ENCODERS].has(controller);
    }
  }]);

  return Bank;
})();

module.exports = Bank;
