'use strict';

const Token = artifacts.require("./Token.sol");
const Controller = artifacts.require("./CtrlPreIco.sol");

const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//console.log(Object.keys(web3));
//console.log(Object.keys(Web3));
//console.log(Object.keys(web3.utils));



contract('Test preIco. Fail story', function(accounts) {

  let token;
  let ctrl;
  let tokenDecimals;

  before(() => {
  
    return Token.deployed().then((_tkn) => {
      token = _tkn;
      return Controller.new(token.address, 50, 100);
    }).then(_ctrl => {
      ctrl = _ctrl;
      return token.decimalsMultiplier();
    }).then(_decMul => {
      tokenDecimals = _decMul;
    });
  });

  /*
  function runTransaction(_from, _ether) {
  
    return new Promise(function(_resolve, _reject) {

      let balanceBefore;
      let wei = web3.utils.toWei(_ether, 'ether');
      web3.eth.getBalance(accounts[_from]).then(_balance => {
        balanceBefore = _balance;
        return web3.eth.sendTransaction({
          to: ctrl.address,
          from: accounts[_from],
          value: wei,
        });
      }).catch(_err => {
        console.log("catched: err: ", _err.message);
        if (-1 < _err.message.indexOf('invalid opcode')) { 
          // testrpc bug?
          return true;
        } else {
          return _reject(_err);
        }
      }).then(() => {
        return web3.eth.getBalance(accounts[_from]);
      }).then(_balance => {
        if (_balance < (balanceBefore - wei)) {
          console.log('resolve');
          return _resolve();
        } else {
          console.log('reject');
          return _reject(new Error("unexpected balance: " + balanceBefore + ' - ' + wei + ' => ' + _balance));
        }
      });

    });
  }
  */

  it("PreIco state must be equal 0", function() {
  
    return ctrl.state().then(_state => {
      assert.equal(0, _state);
      return ctrl.canBuy();
    }).then(_canBuy => {
      assert.equal(false, _canBuy);
    })
  });

  it("Must NOT buy while crowdsale is not open", function(done) {

    
    web3.eth.sendTransaction({
        to: ctrl.address,
        from: accounts[1],
        value: web3.utils.toWei(1, 'ether')
    }).then((_txn) => {
    
    //runTransaction(1, 1).then(() => {
      return done(new Error("Must throw error here!"));
    }).catch(_err => {
      return done();
    });
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

  it("Must throw err when try to open opened crowdsale", function(done) {

    ctrl.open({from: accounts[0]}).then(_txn => {
      return done(new Error("Must throw error when open opened"));
    }).catch(_err => {
      return done();
    });
  });
  
  it("Acc#1 must buy 40 coins for 2 Ether", function(done) {
 
    //console.log('wei: ', web3.utils.toWei(1, 'ether'));
    
    web3.eth.sendTransaction({
      to: ctrl.address,
      from: accounts[1],
      value: web3.utils.toWei(2, 'ether')
    }).then(_txn => {
    
    //runTransaction(1, 1).then(() => {
      return token.balanceOf(accounts[1]);
    }).then(_tokenBalance => {
      //console.log('_tokenBalance: ', _tokenBalance);
      assert.equal(40 * tokenDecimals, _tokenBalance.toNumber());
    }).then(done).catch(done);
  });

  it("Acc#2 must buy 5 coins for 0.25 Ether", function(done) {
 
    let val = web3.utils.toWei(0.25, 'ether');
    //console.log('wei: ', val, typeof val);
    
    //web3.eth.sendTransaction({

    ctrl.buy.sendTransaction({
      to: ctrl.address,
      from: accounts[2],
      value: val
    }).catch(_err => {
     // console.log('err: ', _err.message);
      return;
    }).then(_txn => {
      //console.log('continue...');
    
      return token.balanceOf(accounts[2]);
    }).then(_tokenBalance => {
      //console.log('_tokenBalance: ', _tokenBalance);
      assert.equal(5 * tokenDecimals, _tokenBalance.toNumber());
    }).then(done).catch(done);
  });


  /*
  for(let i = 0; i < 10; i++) {
  it("Acc#1 must buy 20 coins for 1 Ether", function(done) {
 
    runTransaction(1, 1).then(() => {
      return token.balanceOf(accounts[1]);
    }).then(_tokenBalance => {
      //console.log('_tokenBalance: ', _tokenBalance);
      //assert.equal(20 * tokenDecimals, _tokenBalance.toNumber());
      console.log('buyed');
      setTimeout(done, 500);
    });
  });
  }
  */


  it("Acc#1 must NOT getBack his ether while crowdsale is open", function(done) {
 
    let balanceBefore;    
    web3.eth.getBalance(accounts[1]).then(_balance => {
      //console.log("_balance", web3.utils.fromWei(_balance, 'ether'));
      balanceBefore = _balance;
      return ctrl.getBack({from: accounts[1]});
    }).then(_txn => {
      return done(new Error("getBack must throw error"));
    }).catch(_err => {
      return done();
    })
  });

  it("Acc#1 must NOT can close crowdsale", function(done) {

    ctrl.close({from: accounts[1]}).then(_txn => {
      return done(new Error("not-owner can not close crowdsale"));
    }).catch(_err => {
      return done();
    });
  });

  it("Must close crowdsale with state eq 2", function() {

    return ctrl.close({from: accounts[0]}).then(_txn => {
      return ctrl.state();
    }).then(_state => {
      assert.equal(2, _state);
      return ctrl.canBuy();
    }).then(_canBuy => {
      assert.equal(false, _canBuy);
    });
  });

  it("Must NOT buy when crowdsale is closed", function(done) {

    web3.eth.sendTransaction({
        to: ctrl.address,
        from: accounts[1],
        value: web3.utils.toWei(1, 'ether')
    }).then((_txn) => {
      return done(new Error("Must throw error here!"));
    }).catch(_err => {
      return done();
    });
  });

  it("Acc#1 must getBack his almost 1 ether", function(done) {
 
    let balanceBefore;    
    web3.eth.getBalance(accounts[1]).then(_balance => {
      //console.log("_balance", web3.utils.fromWei(_balance, 'ether'));
      balanceBefore = _balance;
      return ctrl.getBack({from: accounts[1]});
    }).then(_txn => {
      return token.balanceOf(accounts[1]);
    }).then(_balance => {
      assert.equal(0, _balance);
      return web3.eth.getBalance(accounts[1]);
    }).then(_balance => {
    
      //console.log('balances: ', balanceBefore, _balance);
      assert(_balance - balanceBefore > web3.utils.toWei(0.9, 'ether')); // 1 ether - some gas
    }).then(done).catch(done);
  });

});
