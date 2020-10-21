var fs = require('fs');
const ipfs = require('./my-ipfs.js');
const Web3Instance = require('./web3-instance.js');

// From https://apkpure.com/app
const appsArray = ['Via Browser Fast Light Geek Best Choice_v3.9.5_apkpure.com.apk.capps',
'Tiles Hop EDM Rush_v3.0.4_apkpure.com.apk.capps',
'Status Saver_v2.80.78_apkpure.com.apk.capps',
'Magic Tiles 3_v7.011.004_apkpure.com.apk.capps',
'Subway Surfers_v1.112.0_apkpure.com.apk.capps',
'2 3 4 Player Mini Games_v3.1.3_apkpure.com.apk.capps',
'Google Chrome Fast Secure_v79.0.3945.93_apkpure.com.apk.capps',
'BeautyPlus Easy Photo Editor Selfie Camera_v7.0.260_apkpure.com.apk.capps',
'Facebook_v251.0.0.31.111_apkpure.com.apk.capps',
'WhatsApp Messenger_v2.19.360_apkpure.com.apk.capps'
]


const start = async () => {

await ipfs.init();
await Web3Instance.init();

for (let i = 1; i < 11; i++){

    let imgFile, appFile, fileHash, imgHash;

    let fileName = `/app ${i}.capps`;
    //let fileName = appsArray[i];


    // if(i == 6 || i == 7)
    // {
    //     // fs.readFile(`./Script Apps/image ${i}.jpeg`, 'utf8', function(err, data) {
    //     //     if (err) throw err;

    //     //     console.log(data);
    //     //     imgHash = ipfs.sendFile(data);

    //     // });

    //     imgFile = fs.readFileSync(`./Script Apps/image ${i}.jpeg`);
    //    // fs.unlinkSync(`./Script Apps/image ${i}.jpeg`);
    // }

    if(i == 1 ){

        // fs.readFile(`./Script Apps/image ${i}.jpg`, 'utf8', function(err, data) {
        //     if (err) throw err;

        //  //   console.log(data);
        //  imgFile = ipfs.sendFile(data);

        // });

        imgFile = fs.readFileSync(`./Script Apps/image ${i}.jpg`);
       // fs.unlinkSync(`./Script Apps/image ${i}.jpg`);        
    }

    else{
        // fs.readFile(`./Script Apps/image ${i}.png`, 'utf8', function(err, data) {
        //     if (err) throw err;

        //     //console.log(data);
        //     imgHash = ipfs.sendFile(data);
        // });

        imgFile = fs.readFileSync(`./Script Apps/image ${i}.png`);
       // fs.unlinkSync(`./Script Apps/image ${i}.png`);        
    }

    imgHash = await ipfs.sendFile(imgFile);

    // fs.readFile(`./Script Apps/app ${i}.capps.docx`, 'utf8', function(err, data) {
    //     if (err) throw err;

    //     //console.log(data);
    //     fileHash = ipfs.readFileSync(data);
    // });

    appFile = fs.readFileSync(`./Script Apps/app ${[i]}.capps.docx`);

    fileHash = await ipfs.sendFile(appFile)
    //appFile = fs.readFileSync(`./Script Apps/${appsArray[i]}`);

   // fs.unlinkSync(`./Script Apps/app ${i}.capps.docx`);        

    Web3Instance.addApp(fileHash, imgHash, fileName, "1.1.1", new Date().getTime(), i);
}


};

start();




