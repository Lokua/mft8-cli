'use strict';

const logger = new require('./logger').createLogger('Twister');

const [GROUPS, GROUP_N, BANK_N, COLORS] = [Symbol(), Symbol(), Symbol(), Symbol()];

class Twister {

  constructor(groups, activeGroupIndex=0, activeBankIndex=0, colors) {
    this[GROUPS] = groups;
    this[GROUP_N] = activeGroupIndex;
    this[BANK_N] = activeBankIndex;
    this[COLORS] = colors;
  }

  getColor(groupIndex, channel, controller) {
    if (groupIndex === null) groupIndex = this[GROUP_N];
    return this[COLORS][groupIndex][channel][controller];
  }

  getActiveGroupIndex() {
    return this[GROUP_N];
  }
  setActiveGroupIndex(n) {
    this[GROUP_N] = n;
    return this;
  }

  getActiveBank() {
    return this[GROUPS][this[GROUP_N]][this[BANK_N]];
  }

  getActiveBankIndex() {
    return this[BANK_N];
  }
  setActiveBankIndex(n) {
    this[BANK_N] = n;
    return this;
  }

  toString() {
    return JSON.stringify({
      groups: this[GROUPS],
      activeGroupIndex: this[GROUP_N],
      activeBankIndex: this[BANK_N],
      colors: this[COLORS],
    }, null, 2);
  }

}

module.exports = Twister;
