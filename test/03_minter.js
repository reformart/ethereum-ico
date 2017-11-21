'use strict';
/*
const Token = artifacts.require("./Token.sol");
const Minter = artifacts.require("./CtrlMinter.sol");

contract('Simple minrter contract', function(accounts) {

  let token;
  let minter;
  let tokenDecimals;

  before(() => {
  
    return Token.deployed().then((_tkn) => {
      token = _tkn;
      return Minter.new(token.address);
    }).then(_mntr => {
      minter = _mntr;
      return token.decimalsMultiplier();
    }).then(_decMul => {
      tokenDecimals = _decMul;
    });
  });

  it.skip("Must make emission of 20 tokens", function() {
  
    return minter.emission(20 * tokenDecimals).then(_res => {
    
      return token.totalSupply();
    }).then(totalSupply => {
    
      //console.log("totalSupply: ", totalSupply);
      assert.equal(120 * tokenDecimals, totalSupply);
    });
  });
});
*/
