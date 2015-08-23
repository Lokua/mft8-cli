# mft8-cli

> A command line application that intercepts MIDI messages from
a MIDI Fighter Twister (MFT), enabling the use of 8 banks instead of
the MFT's hard-wired 4.

#### Note: this readme is still not complete...

This package was made first and foremost for my own live performance needs.
Here is a list of exactly what I wanted, and what was done to accomplish:

### 1. Ability to have 8 banks

This is done through external bank changes, as opposed to using the
side buttons on the MFT.  When the mft8-cli receives bank change numbers that
are beyond the MFT's normal 4, it knows that it is in "override" mode, and
simply adds 64*bankNumber to incoming CC messages.

### 2. Ability to control LED color for all 8 banks

This application completely overrides whatever color mapping is currently on the MFT.
It is reccomended to upload the all-black.mapping file to your MFT. Since we are overriding
the colors by sending MIDI to the MFT, there are brief flashes of the MFT showing its own
mapping color. Setting its defaults to all off solves this problem.

## Development

`grunt build`: build
`grunt`: (default task) build then watch

```bash
npm test
```
