"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CHANNEL = Symbol();
var VALUES = Symbol();

var Encoder = (function () {

  /**
   * @constructor
   * @param  {Number} channel    the current/last active channel
   * @param  {Array}  values     two member array of values for channels 0-1
   * @return {this}
   */

  function Encoder() {
    var channel = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var values = arguments.length <= 1 || arguments[1] === undefined ? [0, 0] : arguments[1];

    _classCallCheck(this, Encoder);

    this[CHANNEL] = channel;
    this[VALUES] = values;
  }

  _createClass(Encoder, [{
    key: "getValue",
    value: function getValue(channel) {
      return this[VALUES][channel];
    }
  }, {
    key: "setValue",
    value: function setValue(channel, value) {
      this[VALUES][channel] = value;
      return this;
    }
  }, {
    key: "getChannel",
    value: function getChannel() {
      return this[CHANNEL];
    }
  }, {
    key: "setChannel",
    value: function setChannel(value) {
      this[CHANNEL] = value;
      return this;
    }
  }, {
    key: "toString",
    value: function toString() {
      return JSON.stringify({
        channel: this[CHANNEL],
        values: this[VALUES]
      });
    }
  }]);

  return Encoder;
})();

module.exports = Encoder;
