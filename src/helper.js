
const logger = require('./logger').createLogger('helper');
const _ = require('lodash')
const Bank = require('./Bank');

module.exports = {

  createGroup() {
    let banks = [];
    for (let i = 0; i < 4; i++) {
      banks[i] = new Bank(i).init();
    }
    logger.debug('banks: %o', banks);
    return banks;
  },

  sleep(time, fn) {
    const stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
    }
    fn();
  },

  defineProp(obj, prop, descriptor) {
    throw new Error('Not implemented');
    return Object.defineProperty(obj, prop, _.merge({
      writable: false
    }, descriptor));
  }

};
