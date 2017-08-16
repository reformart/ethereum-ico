
//const AbstractERC20 = artifacts.require('./AbstractERC20.sol');
const StandardToken = artifacts.require('./StandardToken.sol');

module.exports = function(deployer) {

  //deployer.deploy(AbstractERC20);
  //deployer.link(AbstractERC20, StandardToken);
  deployer.deploy(StandardToken);
};
