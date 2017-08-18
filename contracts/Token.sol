pragma solidity ^0.4.8;

import "./StandardToken.sol";

/**
  This is our trade token for ICO
*/
contract Token is StandardToken {

  string public name = "Osmall Coin Token";
  string public symbol = "OCT";
  int8 public decimals = 8;

  function Token(uint256 _initialSupply) {
  
    balances[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

}

