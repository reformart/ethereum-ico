'use strict';

const Token = artifacts.require("./Token.sol");
const Controller = artifacts.require("./CtrlPreIco.sol");

const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

contract('Test preIco. Success story with automatic close', function(accounts) {

  let token;
  let ctrl;
  let tokenDecimals;

  before(() => {
  
    return Token.deployed().then((_tkn) => {
      token = _tkn;
      return Controller.new(token.address, 40, 50);
    }).then(_ctrl => {
      ctrl = _ctrl;
      return token.decimalsMultiplier();
    }).then(_decMul => {
      tokenDecimals = _decMul;
    });
  });

  it("PreIco state must be equal 0", function() {
  
    return ctrl.state().then(_state => {
      assert.equal(0, _state);
      return ctrl.canBuy();
    }).then(_canBuy => {
      assert.equal(false, _canBuy);
    })
  });

  it("Must turn ON the croudsale", function() {
 
    return ctrl.open({from: accounts[0]}).then(_txn => {
      return ctrl.state();
    }).then(_state => {
      assert.equal(1, _state);
      return ctrl.canBuy();
    }).then(_canBuy => {
      assert.equal(true, _canBuy);
    })
  });

  for(let accNum = 1; accNum <= 3; accNum++) {
    it("Acc#" + accNum + " must buy 20 coins for 1 Ether", function() {
   
      return web3.eth.sendTransaction({
        to: ctrl.address,
        from: accounts[accNum],
        value: web3.utils.toWei(1, 'ether')
      }).then(_txn => {
        return token.balanceOf(accounts[accNum]);
      }).then(_tokenBalance => {
        //console.log('_tokenBalance: ', _tokenBalance);
        assert.equal(20 * tokenDecimals, _tokenBalance.toNumber());
      });
      
    });
  }

  it("Must be closed now automatically", function(done) {
  
    return ctrl.state().then(_state => {
      assert.equal(3, _state);
      return ctrl.canBy()
    }).then(_canBuy => {
      assert.equal(false, _canBuy);
    })

  });

  it("Acc#4 must NOt be able to by", function(done) {
 
    return web3.eth.sendTransaction({
      to: ctrl.address,
      from: accounts[4],
      value: web3.utils.toWei(1, 'ether')
    }).then(_txn => {
      return done(new Error("Must not be able to buy"));
    }).catch(_err => {
      return done();
    });
    
  });

  it("Must throw err when try to close crowdsale when it closed", function(done) {

    ctrl.close({from: accounts[0]}).then(_txn => {
      return done(new Error("Must throw when trye to close closed"))
    }).catch(_err => {
      return done();
    });
  });

  it("Must throw err when try to open crowdsale when it closed", function(done) {

    ctrl.open({from: accounts[0]}).then(_txn => {
      return done(new Error("Must throw when trye to open closed"))
    }).catch(_err => {
      return done();
    });
  });

  it("Acc#1 must NOT getBack his ether", function(done) {
 
    let balanceBefore;    
    web3.eth.getBalance(accounts[1]).then(_balance => {
      //console.log("_balance", web3.utils.fromWei(_balance, 'ether'));
      balanceBefore = _balance;
      return ctrl.getBack({from: accounts[1]});
    }).then(_txn => {
      return done(new Error("Must throw err when try to getback in successfully closed crowdsale"));
    }).catch(_err => {
      return done();
    });
  });

  it("Acc#1 must NOT withdraw ether", function(done) {
    
    ctrl.withdraw({from: accounts[1]}).then(_txn => {
      return done(new Error("Must throw when not owner try to withdraw"));
    }).catch(_err => {
      return done();
    });
  });


  it("Acc#0 must successfully withdraw ether", function(done) {
 
   // console.log('withdraw start');
    let balanceBefore;    
    web3.eth.getBalance(accounts[1]).then(_balance => {
      //console.log("_balance", web3.utils.fromWei(_balance, 'ether'), _balance);
      balanceBefore = parseInt(_balance);
      return ctrl.withdraw({from: accounts[0]});
    }).then(_txn => {
      //console.log('withdraw ok', _txn);
      return web3.eth.getBalance(accounts[0]);
    }).then(_balance => {
      _balance = parseInt(_balance);
      //console.log("now balance: ", web3.utils.fromWei(_balance, 'ether'), _balance, typeof _balance)
      assert(_balance > balanceBefore, "new balance > old balande: " + _balance + " > " + balanceBefore);
      return ctrl.state();
    }).then(_state => {
      //console.log('state: ', _state);
      assert.equal(4, _state);
    }).then(done).catch(done);
  });

  it("Must NOT withdraw again", function(done) {
    
    ctrl.withdraw({from: accounts[0]}).then(_txn => {
      return done(new Error("Must throw err when repeatedly withdraw"));
    }).catch(_err => {
      return done();
    });
  });

});
