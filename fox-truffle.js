// const HDWalletProvider = ('truffle-hdwallet-provider');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require('fs');

let foxSecret;

if(fs.existsSync('fox.json'))
{
    
    foxSecret = JSON.parse(fs.readFileSync('fox.json', 'utf8'));
}

module.exports = {

    networks: {
        development: {
            network_id: "*",
            host: "localhost",
            port: 7545
        },

        rinkeby: {
            provider: new HDWalletProvider(foxSecret.fox-mnemonic, "https://ropsten.infura.io/v3/" + foxSecret.fox-infuraApiKey),
            network_id: '4'
        }
    }
}