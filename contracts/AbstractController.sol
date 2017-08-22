pragma solidity ^0.4.8;

//import "./ControlledToken.sol";
import "./Token.sol";

contract AbstractController {

  Token public token;
  address owner;

  function AbstractController(address _coinToken) {
    owner = msg.sender;
    token = Token(_coinToken);
    token.addController(address(this));
  }

  function getControllerName() returns(string ctrlName);

  modifier ownerOnly {
    if (msg.sender != owner) revert();
    _;
  }

  function isActive() ownerOnly returns (bool _active) {
    return token.checkAccess();
  }
}
