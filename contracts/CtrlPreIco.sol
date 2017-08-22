pragma solidity ^0.4.8;

import "./AbstractController.sol";

contract CtrlPreIco is AbstractController {

  uint8 public constant COINS_PER_ETH = 20;
  //mapping (address => uint256) ethBalances;
  uint256 ethCollected;
  bool public isClosed = true;
  uint256 tokenDecMult;

  event MoneyAction(string _msg, uint256 _value);


  function CtrlPreIco(address _coinToken) AbstractController(_coinToken) {
    tokenDecMult = token.decimalsMultiplier();
  }

  function getControllerName() returns(string ctrlName) {
    return "preICO contract";
  }

  function () payable {
    return buy();
  }

  function buy() payable {

    require(!isClosed);
    MoneyAction('came eth: ', msg.value);
    uint256 amount = msg.value * COINS_PER_ETH * tokenDecMult / 1 ether;
    require(amount > 0);
    MoneyAction('token amount: ', amount);
    token.sellingTo(msg.sender, amount);
    //ethBalances[msg.sender] += msg.value;
    ethCollected += msg.value;
  }

  
  function getBack() {

    //require(isClosed);

    uint256 tokenAmount = token.balanceOf(msg.sender);
    MoneyAction("getBack call. tokens: ", tokenAmount);
    require(tokenAmount > 0);
    uint256 weiAmount = tokenAmount * 1 ether / tokenDecMult / COINS_PER_ETH;
    MoneyAction('return wei: ', weiAmount);

    token.sellingReset(msg.sender);
    msg.sender.transfer(weiAmount);
    //ethBalances[msg.sender] = 0;
    ethCollected -= weiAmount;
  }
  

  function open() ownerOnly {
    isClosed = false;
  }

  function close() ownerOnly {
    isClosed = true;
  }

}
