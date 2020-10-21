const ipfsClient = require('ipfs-api');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// var FileReader = require('filereader')

let ipfs;

let ipfsObject = {
    
    init(){

        ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }); // (the default in Node.js)
    },

    async convertToBuffer(reader) {
            
        return await Buffer.from(reader);
    },

    setFile(file){

        //const reader = new FileReader();

        let fileBuffer;

        //console.log(`**** file[0] is ${file.target}`);
        
       // reader.readAsArrayBuffer(file.target.files[0]);


        // reader.readAsArrayBuffer(file);

        // reader.onloadend = async () => {
            
        //     fileBuffer = await convertToBuffer(reader.result);
        // };

        return file;
    },
    async sendFile(file){
        
        if(file)
        {
            let fileBuffer = this.setFile(file);

            let result = await ipfs.add(fileBuffer);

            return result[0].hash;
        }
        else return null;
    }
};

module.exports = ipfsObject;