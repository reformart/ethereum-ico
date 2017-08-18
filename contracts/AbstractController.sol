pragma solidity ^0.4.8;

import "./ControlledToken.sol";

contract AbstractController {

  ControlledToken public token;
  address owner;

  function AbstractController(address _coinToken) {
    owner = msg.sender;
    token = ControlledToken(_coinToken);
    token.addController(address(this));
  }

  modifier ownerOnly {
    if (msg.sender != owner) revert();
    _;
  }

  function isActive() ownerOnly returns (bool _active) {
    return token.checkAccess();
  }
}
