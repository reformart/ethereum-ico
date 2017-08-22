'use strict';

const Token = artifacts.require("./Token.sol");

contract('ERC20 compatibility', function(accounts) {

  //console.log(accounts);


  let instance;
  let tokenDecimals;

  before(() => {
  
    return Token.deployed().then((_instance) => {
      instance = _instance;
      return instance.decimalsMultiplier();
    }).then(_decMul => {
      tokenDecimals = _decMul;
    });
  });



  beforeEach(function() {
    //this.slow(1000);
    //this.timeout(5000);
  });

  it("Acc#0 should have 100 tokens on balance", function() {
    return instance.balanceOf.call(accounts[0]).then((_balance) => {
      //console.log("balance: ", _balance);
      assert.equal(_balance, 100 * tokenDecimals);
    });
  });

  it("Acc#1 should have 0 tokens on balance", function() {
    return instance.balanceOf.call(accounts[1]).then((_balance) => {
      //console.log("balance: ", _balance);
      assert.equal(_balance, 0);
    });
  });

  it("Acc#0 should transfer 10 tokens to #1", function() {
  
    return instance.transfer(accounts[1], 10 * tokenDecimals, {from: accounts[0]}).then((_success) => {
    
      assert(_success);
      return instance.balanceOf(accounts[0]);
    }).then((_balance) => {
      //console.log("balance: ", _balance);
      assert.equal(_balance, 90 * tokenDecimals);
      return instance.balanceOf(accounts[1]);
    }).then((_balance) => {
      assert.equal(_balance, 10 * tokenDecimals);
    });
  });

  it("Acc#1 must NOT send 20 tokens to #0 (not enouth)", function(done) {
 
    instance.transfer.call(accounts[0], 20 * tokenDecimals, {from: accounts[1]})
      .then((_success) => {
        // WTF?
        return done(new Error("Unexpected success transfer"));
      }).catch(_err => {
        return done();
      });

  });


});

