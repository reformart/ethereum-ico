'use strict';

const Token = artifacts.require("./Token.sol");
const Controller = artifacts.require("./CtrlPreIco.sol");

const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));




  Token.deployed().then((_tkn) => {
    _tkn;
    return Controller.new(_tkn.address, 50, 100);
  }).then(_ctrl => {
    _ctrl;
    console.log(JSON.stringify(_ctrl.abi));
    return true;
  });



/*
Controller.deployed().then((_ctrl) => {

  console.log(_ctrl.abi);
});
*/
