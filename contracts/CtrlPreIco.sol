pragma solidity ^0.4.8;

import "./AbstractController.sol";

contract CtrlPreIco is AbstractController {

  //uint8 public constant COINS_PER_ETH = 20;
  uint256 public constant COINS_PER_ETH = 3000;
  //mapping (address => uint256) ethBalances;
  uint256 ethCollected;
  uint256 tokenSold;
  uint256 tokenDecMult;
  uint8 public state = 0; // 0 - not started yet
                          // 1 - running
                          // 2 - closed mannually and not success
                          // 3 - closed and target reached success
                          // 4 - success & funds withdrawed

  uint256 public targetSoftCap;
  uint256 public targetHardCap;

  //event MoneyAction(string _msg, uint256 _value);
  event SaleClosedSuccess(uint256 _tokenSold);
  event SaleClosedFail(uint256 _tokenSold);

  function CtrlPreIco(address _coinToken, uint256 _softCap, uint256 _hardCap) AbstractController(_coinToken) {
    tokenDecMult = token.decimalsMultiplier();
    targetSoftCap = _softCap * tokenDecMult;
    targetHardCap = _hardCap * tokenDecMult;
  }

  function getControllerName() returns(string ctrlName) {
    return "preICO contract";
  }

  function () payable {
    return buy();
  }

  function buy() payable {

    //require(!isClosed);
    require(canBuy());
    //MoneyAction('came eth: ', msg.value);
    //uint256 amount = msg.value / 1 ether * COINS_PER_ETH * tokenDecMult;
    uint256 amount = msg.value * COINS_PER_ETH / (1 ether / tokenDecMult);
    require(amount > 0);
    //MoneyAction('token amount: ', amount);
    token.sellingTo(msg.sender, amount);
    //ethBalances[msg.sender] += msg.value;
    ethCollected += msg.value;
    tokenSold += amount;
    if (tokenSold >= targetHardCap) {
      SaleClosedSuccess(tokenSold);
      state = 3;
    }
  }

  function canBuy() constant returns(bool _canBuy) {
    return state == 1;
  }



  
  function refund() {

    require(state == 2);

    uint256 tokenAmount = token.balanceOf(msg.sender);
    //MoneyAction("refund call. tokens: ", tokenAmount);
    require(tokenAmount > 0);
    uint256 weiAmount = tokenAmount * 1 ether / tokenDecMult / COINS_PER_ETH;
    //MoneyAction('return wei: ', weiAmount);

    token.sellingReset(msg.sender);
    msg.sender.transfer(weiAmount);
    //ethBalances[msg.sender] = 0;
    ethCollected -= weiAmount;
  }
 
  function withdraw() ownerOnly {
    
    require(state == 3);
    owner.transfer(ethCollected);
    ethCollected = 0;
    state = 4;
  }

  function open() ownerOnly {
    require(state == 0);
    state = 1;
  }

  function close() ownerOnly {
    require(state == 1);
    if (tokenSold >= targetSoftCap) {
      SaleClosedSuccess(tokenSold);
      state = 3;
    } else {
      SaleClosedFail(tokenSold);
      state = 2;
    }
  }

}
