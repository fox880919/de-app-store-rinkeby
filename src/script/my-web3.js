const Web3 = require('web3');
// const MyContract = require('./build/contracts/PackageStore.json');

const MyContract = require('/Users/faiezaltamimi/Desktop/City, University of London/JS Project/AppsStore/apps_store/src/contracts/PackageStore.json');

//Old Metamask
// const web3 = new Web3(window.web3.currentProvider);

//New Metamask
// const web3 = new Web3(window.ethereum);
//web3.eth.getBlockNumber().then(() => console.log('done'));
//await.window.ethereum.enable();

let web3, contract;

let web3Object = {

  async init(){

    web3 = new Web3('http://localhost:7545');
  
    const id = await web3.eth.net.getId();

    // console.log(`**** id is ${id}`);

  
    const deployedNetwork = MyContract.networks[id];
    
    // console.log(`**** deployedNetwork is ${deployedNetwork}`);

     contract = await new web3.eth.Contract(MyContract.abi, deployedNetwork.address);

    //  console.log(`**** contract is ${contract}`);
     return {web3, contract};
  }

};

module.exports = web3Object;

//let currentAccount;

// async updateAccount() {
//     const accounts = await web3.eth.getAccounts();
//     const account = accounts[0];
//     this.currentAccount = account;
//   }

