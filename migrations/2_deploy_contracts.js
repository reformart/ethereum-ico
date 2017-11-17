
const Token = artifacts.require('./Token.sol');
const CtrlPreIco = artifacts.require('./CtrlPreIco.sol');

module.exports = function(deployer, network) {
  console.log('network:', network);

  if (network == 'kovan') {
    deployer.deploy(Token, 1100 * Math.pow(10, 8)).then(function() {
      deployer.deploy(CtrlPreIco, Token.address, 100, 200);
    });
  } else if (network == 'real') {

    deployer.deploy(Token, 100000000 * Math.pow(10, 8));

  } else { // devel
    deployer.deploy(Token, 100 * Math.pow(10, 8));
    /*
    deployer.deploy(Token, 100 * Math.pow(10, 8)).then(function() {
      deployer.deploy(CtrlPreIco, Token.address, 10, 20);
    });
    */
    
  }
};
