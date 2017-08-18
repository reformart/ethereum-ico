'use strict';

const Token = artifacts.require("./Token.sol");


contract('Token', function(accounts) {

  console.log(accounts);


  let instance;

  before(() => {
  
    return Token.deployed().then((_instance) => {
      instance = _instance;
    });
  });



  beforeEach(function() {
    //this.slow(1000);
    //this.timeout(5000);
  });

  it("Acc#0 should have 100 tokens on balance", function() {
    return instance.balanceOf.call(accounts[0]).then((_balance) => {
      //console.log("balance: ", _balance);
      assert.equal(_balance, 100);
    });
  });

  it("Acc#1 should have 0 tokens on balance", function() {
    return instance.balanceOf.call(accounts[1]).then((_balance) => {
      //console.log("balance: ", _balance);
      assert.equal(_balance, 0);
    });
  });

  it("Acc#0 should transfer 10 tokens to #1", function() {
  
    return instance.transfer(accounts[1], 10, {from: accounts[0]}).then((_success) => {
    
      assert(_success);
      return instance.balanceOf(accounts[0]);
    }).then((_balance) => {
      //console.log("balance: ", _balance);
      assert.equal(_balance, 90);
      return instance.balanceOf(accounts[1]);
    }).then((_balance) => {
      assert.equal(_balance, 10);
    });
  });

  it("Acc#1 must NOT send 20 tokens to #0 (not enouth)", function(done) {
 
    instance.transfer.call(accounts[0], 20, {from: accounts[1]})
      .then((_success) => {
        // WTF?
        return done(new Error("Unexpected success transfer"));
      }).catch(_err => {
        return done();
      });

  });


});

/*
contract('MetaCoin', function(accounts) {
  it("should put 10000 MetaCoin in the first account", function() {
    return MetaCoin.deployed().then(function(instance) {
      return instance.getBalance.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
  });
  it("should call a function that depends on a linked library", function() {
    var meta;
    var metaCoinBalance;
    var metaCoinEthBalance;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(accounts[0]);
    }).then(function(outCoinBalance) {
      metaCoinBalance = outCoinBalance.toNumber();
      return meta.getBalanceInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      metaCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpected function, linkage may be broken");
    });
  });
  it("should send coin correctly", function() {
    var meta;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return meta.sendCoin(account_two, amount, {from: account_one});
    }).then(function() {
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });
});
*/
