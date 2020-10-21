const PackageStore = artifacts.require("PackageStore");

module.exports = function(deployer) {
  deployer.deploy(PackageStore);
};