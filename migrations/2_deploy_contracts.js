
//const AbstractERC20 = artifacts.require('./AbstractERC20.sol');
//const StandardToken = artifacts.require('./StandardToken.sol');
const Token = artifacts.require('./Token.sol');

module.exports = function(deployer) {

  //deployer.deploy(AbstractERC20);
  //deployer.link(AbstractERC20, StandardToken);
  deployer.deploy(Token, 100 * Math.pow(10, 8));
};
