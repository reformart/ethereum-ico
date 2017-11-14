
//const AbstractERC20 = artifacts.require('./AbstractERC20.sol');
//const StandardToken = artifacts.require('./StandardToken.sol');
const Token = artifacts.require('./Token.sol');
const CtrlPreIco = artifacts.require('./CtrlPreIco.sol');

module.exports = function(deployer, network) {
  console.log('network:', network);

  //deployer.deploy(AbstractERC20);
  //deployer.link(AbstractERC20, StandardToken);
  if (network == 'kovan') {
    deployer.deploy(Token, 1100 * Math.pow(10, 8)).then(function() {
      deployer.deploy(CtrlPreIco, Token.address, 100, 200);
    });
  } else { // devel
    deployer.deploy(Token, 100 * Math.pow(10, 8));
    
  }
};
