var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer, network) {
  if (network == 'real') return;
  deployer.deploy(Migrations, {gas: 500000});
};
