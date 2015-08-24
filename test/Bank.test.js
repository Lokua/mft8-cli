
const expect = require('chai').expect;
const Bank = require('../src/Bank');
const Encoder = require('../src/Encoder');

describe('Bank', () => {

  let bank, bank7;

  beforeEach(() => {
    bank = new Bank(0).init();
    bank7 = new Bank(7).init();
  });

  it('should instantiate...', () => {
    expect(bank).to.be.instanceof(Bank);
    expect(bank7).to.be.instanceof(Bank);
  });

  describe('init/hasController', () => {
    it('should set all encoders cc and values', () => {
      expect(bank.hasController(0)).to.be.true;
      expect(bank.hasController(15)).to.be.true;
      expect(bank.hasController(16)).to.be.false;
      expect(bank7.hasController(112)).to.be.true;
      expect(bank7.hasController(127)).to.be.true;
      expect(bank7.hasController(111)).to.be.false;
    });
  });

  describe('getValue', () => {
    it('should have all zero values for all controllers on all channels', () => {
      for (let i = 0; i < 16; i++) {
        expect(bank.getValue(0,i)).to.eql(0);
        expect(bank.getValue(1,i)).to.eql(0);
        expect(bank7.getValue(0,7*16+i)).to.eql(0);
        expect(bank7.getValue(1,7*16+i)).to.eql(0);
      }
    });
  });

  describe('getActiveChannelForController', () => {
    it('should return only the channel that is active', () => {
      expect(bank.getActiveChannelForController(0)).to.eql(0);
    });
  });

  describe('getActiveValueForController', () => {
    it('should return only the active value', () => {
      expect(bank.getActiveValueForController(0)).to.eql(0);
    });
  });

  describe('setEncoderFromMessage', () => {
    it('should the encoder values', () => {
      for (let i = 0; i < 16; i++) {
        bank.setEncoderFromMessage({channel:1,controller:i,value:42});
        expect(bank.getActiveChannelForController(i)).to.eql(1);
        expect(bank.getActiveValueForController(i)).to.eql(42);

        bank7.setEncoderFromMessage({channel:1,controller:7*16+i,value:42});
        expect(bank7.getActiveChannelForController(7*16+i)).to.eql(1);
        expect(bank7.getActiveValueForController(7*16+i)).to.eql(42);
      }
    });
  });

});
