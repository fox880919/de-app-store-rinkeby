const Web3 = require('./my-web3.js');

let web3Object, ContractObject, addresses, estimateGas = 0;

let webInstance = {

    web3Object, ContractObject, addresses, estimateGas,

    async init() {


        let {web3, contract} = await Web3.init();
         
        this.web3Object = web3;

        //  console.log(`**** web3Object is ${this.web3Object}`);

        this.addresses = await this.web3Object.eth.getAccounts();
         
        this.ContractObject = contract; 
        
        // console.log(`**** ContractObject is ${this.ContractObject}`);

        // console.log(`**** addresses is ${this.addresses}`);


    },

    async addApp(fileHash, imgHash, fileName, version, date, i){

        //console.log(`**** Web3 is ${Web3}`);

        console.log(`**** ContractObject is ${this.ContractObject}`);

        if(estimateGas == 0)
        {

            this.gasEstimate  = await this.ContractObject.methods.addNewPackage(fileHash, imgHash, fileName, version, date)
            .estimateGas({from: this.addresses[0]});

            estimateGas = this.estimateGas;

            console.log(`**** Starting Estimate Gas = ${this.gasEstimate}`)
        }
        else{

            console.log(`**** Current Estimate Gas = ${this.gasEstimate}`)
        }


        await this.ContractObject.methods.addNewPackage(fileHash, imgHash, fileName, version, date).send({
            from: this.addresses[0],
            gas: 2* this.gasEstimate,
            //gasPrice:100,
        });

        const data = await this.ContractObject.methods.getPackageInfo(i).call();
        //console.log(data);
    },
}

module.exports = webInstance;

