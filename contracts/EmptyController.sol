pragma solidity ^0.4.8;

import "./AbstractController.sol";

contract EmptyController is AbstractController{


  function EmptyController (address _coinToken) AbstractController(_coinToken) {
  }

  function getControllerName() returns(string ctrlName) {
    return "Empty controller for tests";
  }
}
