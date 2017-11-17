pragma solidity ^0.4.8;

import "./StandardToken.sol";
import "./ControlledToken.sol";

/**
  This is our trade token for ICO
*/
contract Token is StandardToken, ControlledToken {

  address owner;
  string public name = "Osmall Coin Token";
  string public symbol = "OCT";
  uint8 public decimals = 8;
  uint256 public decimalsMultiplier = 1e8;

  event Emission(address controllerAddress, uint256 amount);

  function Token(uint256 _initialSupply) {
  
    owner = msg.sender;
    balances[owner] = _initialSupply;
    totalSupply = _initialSupply;
  }

  /*
  function emission(uint256 _amount) controllersOnly {
    
    balances[owner] += _amount;
    totalSupply += _amount;
    Emission(msg.sender, _amount);
  }
  */

  function sellingTo(address _to, uint256 _value) controllersOnly {
  
    require(balances[owner] >= _value);
    require(_to != 0x0);

    balances[owner] -= _value;
    balances[_to] += _value;
    Transfer(owner, _to, _value);
  }

  function sellingReset(address _from) controllersOnly {
    require(balances[_from] > 0);
    uint256 amount = balances[_from];
    balances[owner] += amount;
    balances[_from] = 0;
    Transfer(_from, owner, amount);
  }

  /*
  function sellingOut(address _from, uint256 _value) controllersOnly {
  
    require(balances[_from] >= _value);

    balances[_from] -= _value;
    balances[owner] += _value;
    Transfer(_from, owner, _value);
    return true;
  }
  */


}

