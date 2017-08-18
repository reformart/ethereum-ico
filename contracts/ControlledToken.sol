pragma solidity ^0.4.8;

contract ControlledToken {

  address owner;
  mapping (address => bool) public controllers;

  event ControllerAdded(address _controllerContractAddress);
  event ControllerRemoved(address _controllerContractAddress);

  function ControlledToken() {
    owner = msg.sender;
  }

  function addController(address _controllerContract) returns (bool success) {

    /*
    *  If function called by other contract, wiil be:
    * msg.sender - address of that contract
    * tx.origin - address of primasy source of transaction
    */
    //require(msg.sender == owner);
    require(tx.origin == owner);

    controllers[_controllerContract] = true;
    ControllerAdded(_controllerContract);
    return true;
  }

  function rmController(address _controllerContract) returns (bool _success) {

    require(tx.origin == owner);

    controllers[_controllerContract] = false;
    ControllerRemoved(_controllerContract);
    return true;
    
  }

  modifier controllersOnly {
    if (!controllers[msg.sender]) {
      //Error("Controller not accepted");
      revert();
    } else {
      _;
    }
  }

  function checkAccess() returns (bool _success) {
    return controllers[msg.sender];
  }
}
