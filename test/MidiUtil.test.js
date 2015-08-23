
const mockery = require('mockery');
let portMock = {
  getPortCount() { return 3; },
  getPortName(n) { return n === 0 ? 'foo' : n === 1 ? 'bar' : 'baz'; }
};
let midiMock = {
  input() { return portMock; },
  output() { return portMock; }
};
mockery.registerMock('midi', midiMock);
mockery.enable({ useCleanCache: true, warnOnUnregistered: false });

const expect = require('chai').expect;
// const sinon = require('sinon');
const midi = require('midi');
const MidiUtil = require('../lib/cli/MidiUtil');

describe('MidiUtil', () => {

  it('should have static methods and no instance members', () => {
    expect(MidiUtil.NOTE_ON).to.eql(127);
    expect(MidiUtil.NOTE_OFF).to.eql(0);
    const midiUtil = new MidiUtil();
    expect(Object.getOwnPropertyNames(midiUtil)).to.eql([]);
    expect(midiUtil).to.be.instanceof(MidiUtil);
  });

  describe('makeNote', () => {
    it('should return channel, controller, etc.', () => {
      expect(MidiUtil.makeNote(0,1,MidiUtil.NOTE_ON)).to.eql({channel:0,note:1,velocity:127})
    });
    it('should default to NOTE_ON', () => {
      expect(MidiUtil.makeNote(0,0)).to.eql({channel:0,note:0,velocity:127});
    });
  });

  describe('makeNoteOn/makeNoteOff', () => {
    it('...', () => {
      expect(MidiUtil.makeNoteOn(0,0)).to.eql({channel:0,note:0,velocity:127});
      expect(MidiUtil.makeNoteOff(0,0)).to.eql({channel:0,note:0,velocity:0});
      function fn() { MidiUtil.NOTE_OFF = 99; }
      expect(fn).to.throw(TypeError);
      function fn() { MidiUtil.NOTE_ON = 99; }
      expect(fn).to.throw(TypeError);
    });
  });

  describe('makeControlChange', () => {
    it('...', () => {
      expect(MidiUtil.makeControlChange(2,2,2)).to.eql({channel:2,controller:2,value:2});
    });
    it('should default to value=0', () => {
      expect(MidiUtil.makeControlChange(2,2)).to.eql({channel:2,controller:2,value:0});
    });
  });

  describe('getInputs/getOutputs', () => {
    it('should return an array of port names', () => {
      expect(MidiUtil.getInputs()).to.eql(['foo', 'bar', 'baz']);
      expect(MidiUtil.getOutputs()).to.eql(['foo', 'bar', 'baz']);
    });
  });
});
