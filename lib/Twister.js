'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var logger = new require('./logger').createLogger('Twister');

var GROUPS = Symbol();
var GROUP_N = Symbol();
var BANK_N = Symbol();
var COLORS = Symbol();

var Twister = (function () {
  function Twister(groups, activeGroupIndex, activeBankIndex, colors) {
    if (activeGroupIndex === undefined) activeGroupIndex = 0;
    if (activeBankIndex === undefined) activeBankIndex = 0;

    _classCallCheck(this, Twister);

    this[GROUPS] = groups;
    this[GROUP_N] = activeGroupIndex;
    this[BANK_N] = activeBankIndex;
    this[COLORS] = colors;
  }

  _createClass(Twister, [{
    key: 'getColor',
    value: function getColor(groupIndex, channel, controller) {
      if (groupIndex === null) groupIndex = this[GROUP_N];
      return this[COLORS][groupIndex][channel][controller];
    }
  }, {
    key: 'getActiveGroupIndex',
    value: function getActiveGroupIndex() {
      return this[GROUP_N];
    }
  }, {
    key: 'setActiveGroupIndex',
    value: function setActiveGroupIndex(n) {
      this[GROUP_N] = n;
      return this;
    }
  }, {
    key: 'getActiveBank',
    value: function getActiveBank() {
      return this[GROUPS][this[GROUP_N]][this[BANK_N]];
    }
  }, {
    key: 'getActiveBankIndex',
    value: function getActiveBankIndex() {
      return this[BANK_N];
    }
  }, {
    key: 'setActiveBankIndex',
    value: function setActiveBankIndex(n) {
      this[BANK_N] = n;
      return this;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return JSON.stringify({
        groups: this[GROUPS],
        activeGroupIndex: this[GROUP_N],
        activeBankIndex: this[BANK_N],
        colors: this[COLORS]
      }, null, 2);
    }
  }]);

  return Twister;
})();

module.exports = Twister;
