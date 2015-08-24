
const Twister = require('../src/Twister');
const Bank = require('../src/Bank');
const colors = require('./fixtures/test-mapping.json');
const expect = require('chai').expect;

function createGroup() {
  let banks = [];
  for (let i = 0; i < 4; i++) {
    banks[i] = new Bank(i);
    banks[i].init();
  }
  return banks;
}

describe('Twister', () => {

  let twister;

  beforeEach(() => {
    twister = new Twister([createGroup(),createGroup],0,0,colors);
  });

  it('Should instantiate...', () => {
    expect(twister).to.be.instanceof(Twister);
  });

  describe('getColor', () => {
    it('should return the color for the active group', () => {
      expect(twister.getColor(null,0,0)).to.eql(10);
    });
    it('should return the color for whatever group/channel/controller', () => {
      for (let i = 0; i < 16; i++) {

        // group 0, channel 0
        expect(twister.getColor(0,0,i)).to.eql(10);
        expect(twister.getColor(0,0,i+16)).to.eql(20);
        expect(twister.getColor(0,0,i+32)).to.eql(30);
        expect(twister.getColor(0,0,i+48)).to.eql(40);

        // group 0, channel 1
        expect(twister.getColor(0,1,i)).to.eql(125);
        expect(twister.getColor(0,1,i+16)).to.eql(125);
        expect(twister.getColor(0,1,i+32)).to.eql(125);
        expect(twister.getColor(0,1,i+48)).to.eql(125);

        // group 1, channel 0
        expect(twister.getColor(1,0,i)).to.eql(70);
        expect(twister.getColor(1,0,i+16)).to.eql(80);
        expect(twister.getColor(1,0,i+32)).to.eql(90);
        expect(twister.getColor(1,0,i+48)).to.eql(100);

        // group 1, channel 1
        expect(twister.getColor(1,1,i)).to.eql(125);
        expect(twister.getColor(1,1,i+16)).to.eql(125);
        expect(twister.getColor(1,1,i+32)).to.eql(125);
        expect(twister.getColor(1,1,i+48)).to.eql(125);
      }
    });
  });

  describe('get/setActiveGroupIndex', () => {
    it('should return the active group index', () => {
      expect(twister.getActiveGroupIndex()).to.eql(0);
    });
    it('should return after being set', () => {
      twister.setActiveGroupIndex(1);
      expect(twister.getActiveGroupIndex()).to.eql(1);
      twister.setActiveGroupIndex(0);
      expect(twister.getActiveGroupIndex()).to.eql(0);
    });
  });

  describe('getActiveBank', () => {
    it('should return the active bank object', () => {
      const bank = twister.getActiveBank();
      expect(bank).to.be.instanceof(Bank);
    });
  });

  describe('get/setActiveBankIndex', () => {
    it('should...', () => {
      expect(twister.getActiveBankIndex()).to.eql(0);
      twister.setActiveBankIndex(3);
      expect(twister.getActiveBankIndex()).to.eql(3);
    });
  });

});
