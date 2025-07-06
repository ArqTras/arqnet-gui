# Arqnet Control GUI

This repository contains a cross-platform GUI for controlling and observing stats from a locally-running arqnet. See also [arq-network](https://github.com/arqma/arq-network).

## Build Instructions

Build deps:

- [nvm](https://github.com/nvm-sh/nvm) or [asdf](https://github.com/asdf-vm/asdf)
- git
- wine (for windows builds)

For node related deps:

- nodejs 17.x with npm and yarn

OR

- [nvm](https://github.com/nvm-sh/nvm) or [asdf](https://github.com/asdf-vm/asdf)

Clone the repo:

    $ git clone --recursive https://github.com/arqma/arqnet-gui
    $ cd arqnet-gui

If using asdf:

    $ asdf install

Build the project:

    $ yarn install --frozen-lockfile
    $ yarn dist


### Development

It looks like everytime we fix CI builds, dev builds break, and the other side happens too.
So I've decided to remove the dev setup entirely.

To do change the code and see the result, the easiest is to now work on ubuntu, do your change, and run `yarn appImage`. This gets you an appImage in `./release`.

## Env variables

`OPEN_DEV_TOOLS=1` to open dev tools on start up

## Credits

Based on Lokinet-GUI
