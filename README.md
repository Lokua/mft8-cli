# mft8-cli

> A command line application that intercepts MIDI messages from
a [MIDI Fighter Twister][mft] (MFT), enabling the use of 8 banks instead of
the MFT's hard-wired 4.

#### Note:
mft8-cli is still under early development and has yet to be tested on non-windows
machines (though this WILL happen eventually)

#### Note:
All references to MIDI channels and controllers are from a zero-indexed
perspective: channels are 0-15, controllers are 0-127, so when we say "Channel 3",
your DAW most likely calls this "Channel 4"

## The Problem

This package was made first and foremost for my own live performance needs.
Here is a list of exactly what I wanted, and what was done to accomplish:

1. Ability to have 8 banks of controls, with each control set to "Shift Encoder Toggle", which gives us:

  `8 banks * 16 controllers * 2channels = 256 controls`

2. Ability configure LED color for all controls for all channels on all 8 banks

## How it works

The __mft8-cli__ works by intercepting MIDI from the MFT output port, and forwarding
that to a virtual port into your DAW. Bank changes to the MFT work by setting up
a channel in your DAW that sends notes 0-7 on Channel 3 (by default, though this is configurable) to a virtual output port, which are then sent to the MFT input port from the __mft8-cli__ application.
This project is currently being developed on a machine running Windows 10, which
has no native mechanism to create virtual ports on the fly. To create virtual ports
on a Windows machine, I'd recommend using Tobias Erichsen's [loopMIDI][loop].  Create two ports: one named __mft8in__, and another named __mft8out__.

An overview of the routing/control flow looks like this:

```
# control changes to your DAW, channels 0-1, controllers 0-127
Midi Fighter Twister > mft8in > DAW

# Bank changes from your DAW, to your MFT
DAW (track out channel 3) > mft8out > Midi Fighter Twister
```

## Prerequisites

To run __mft8-cli__, you'll need the following:

1. Node.js (and npm, which comes with node)
2. A mechanism to create virtual MIDI ports (like [loopMIDI][loop])

Note: this section is incomplete, users will also need a way to compile native
modules - I am still unsure how to make this process friendly for non-developers.

## Usage

From the project root run `node ./lib/app --interactive` to be guided through
the port setup process.

> more to come...

## Development

Source code is written in ES6, transpiled to ES5 with grunt-babel.

Build:
```bash
$ grunt build
```

Watch:
```bash
$ grunt
```

Testing is done with [Mocha][mocha], [Chai][chai], and [Mockery][mock]
```bash
$ npm test
```

[mft]:https://store.djtechtools.com/products/midi-fighter-twister
[loop]:http://www.tobias-erichsen.de/software/loopmidi.html
[mocha]:https://mochajs.org/
[chai]:http://chaijs.com/
[mock]:https://github.com/mfncooper/mockery
