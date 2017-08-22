# ethereum-ico
Using truffle framework

Implement controllers system for make crowdsale stages

contracts/Token - currency token (ERC20 compatible)
contracts/CtrlMinter - simple contract to make some emission if neccesary (not planning)
contracts/CtrlPreIco - contract to make pre-ico phase of all ICO comnpany

other controller not implemented yet...

## install & run
```sh
  npm install -g ethereumjs-testrpc
  npm install -g truffle
  npm install
  testrpc > /dev/null &
  npm test

