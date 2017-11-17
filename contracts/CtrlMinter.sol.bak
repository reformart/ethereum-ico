pragma solidity ^0.4.8;

import "./AbstractController.sol";

contract CtrlMinter is AbstractController{

  function CtrlMinter(address _coinToken) AbstractController(_coinToken) {

  }

  function getControllerName() returns(string ctrlName) {
    return "Minter controller";
  }

  function emission(uint256 _amount) ownerOnly {

    token.emission(_amount);
  }
}
