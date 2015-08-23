'use strict';

var logger = require('./logger').createLogger('helper');
var _ = require('lodash');
var Bank = require('./Bank');

module.exports = {

  createGroup: function createGroup() {
    var banks = [];
    for (var i = 0; i < 4; i++) {
      banks[i] = new Bank(i).init();
    }
    logger.debug('banks: %o', banks);
    return banks;
  },

  sleep: function sleep(time, fn) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {}
    fn();
  },

  defineProp: function defineProp(obj, prop, descriptor) {
    throw new Error('Not implemented');
    return Object.defineProperty(obj, prop, _.merge({
      writable: false
    }, descriptor));
  }

};
