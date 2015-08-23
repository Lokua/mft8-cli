
const [CHANNEL, VALUES] = [Symbol(), Symbol()];

class Encoder {


  /**
   * @constructor
   * @param  {Number} channel    the current/last active channel
   * @param  {Array}  values     two member array of values for channels 0-1
   * @return {this}
   */
  constructor(channel=0, values=[0,0]) {
    this[CHANNEL] = channel;
    this[VALUES] = values;
  }

  getValue(channel) {
    return this[VALUES][channel];
  }

  setValue(channel, value) {
    this[VALUES][channel] = value;
    return this;
  }

  getChannel() {
    return this[CHANNEL];
  }

  setChannel(value) {
    this[CHANNEL] = value;
    return this;
  }

  toString() {
    return JSON.stringify({
      channel: this[CHANNEL],
      values: this[VALUES]
    });
  }

}

module.exports = Encoder;
