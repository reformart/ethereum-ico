'use strict';

const Token = artifacts.require("./ControlledToken.sol");
const Controller = artifacts.require("./AbstractController.sol");

describe("Test token-controller assignment", function() {

  let token;
  let controller;

  before(function(done) {
  
    Token.new(100).then((_token) => {
      token = _token;
      return Controller.new(token.address);
    }).then(_controller => {
      controller = _controller;
      return done();
    });
  });

  it("Must have controller.token linked to token", function() {
  
    return controller.token().then(_tknAddr => {
      assert.equal(_tknAddr, token.address);
    });
  });

  it("Must be token.controllers[ctrl.address] == true", function() {
  
    return token.controllers(controller.address).then(_res => {

      //console.log('ctrl res: ', _res);
      assert.ok(_res);
    });
  });

  it("Must be controller.isActive() == true", function() {
  
    return controller.isActive.call().then(result => {
      assert.equal(true, result);
    })
  });

  it("Must switch off controller from token", function() {
  
    return token.rmController(controller.address).then(_txn => {
      return controller.isActive.call().then(result => {
        assert.equal(false, result);
      });
    });
  });

  
});
