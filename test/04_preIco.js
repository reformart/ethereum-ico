'use strict';

const Token = artifacts.require("./Token.sol");
const Controller = artifacts.require("./CtrlPreIco.sol");

const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//console.log(Object.keys(web3));
//console.log(Object.keys(Web3));
//console.log(Object.keys(web3.utils));



contract('Test preIco Contract', function(accounts) {

  let token;
  let ctrl;
  let tokenDecimals;

  before(() => {
  
    return Token.deployed().then((_tkn) => {
      token = _tkn;
      return Controller.new(token.address);
    }).then(_ctrl => {
      ctrl = _ctrl;
      return token.decimalsMultiplier();
    }).then(_decMul => {
      tokenDecimals = _decMul;
    });
  });

  it("Check balance for Acc#1", function() {
  
    return web3.eth.getBalance(accounts[1]).then(_balance => {
      //console.log("_balance", web3.utils.fromWei(_balance, 'ether'));
    })
  });

  it("Must NOT buy while crowdsale is closed", function(done) {


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

  
  it("Must turn ON the croudsale", function() {
 
    //console.log(ctrl.isClosed);
    
    return ctrl.open({from: accounts[0]}).then(_txn => {
    
      return ctrl.isClosed().then(_isClosed => {
        assert.equal(false, _isClosed);
      });
    });
    
  });
  
  it("Acc#1 must buy 20 coins for 1 Ether", function() {
 
    //console.log('wei: ', web3.utils.toWei(1, 'ether'));
    return web3.eth.sendTransaction({
      to: ctrl.address,
      from: accounts[1],
      value: web3.utils.toWei(1, 'ether')
    }).then(_txn => {
      return token.balanceOf(accounts[1]);
    }).then(_tokenBalance => {
      //console.log('_tokenBalance: ', _tokenBalance);
      assert.equal(20 * tokenDecimals, _tokenBalance);
    });
  });

  it("Acc#1 must getBack his almost 1 ether", function() {
 
    let balanceBefore;    
    return web3.eth.getBalance(accounts[1]).then(_balance => {
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
    });
  });
  


});
