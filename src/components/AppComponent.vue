<template >
<div class="container" v-if="doShowDiv">
    <div class="row" >
        <div  class="card col bg-info" >
            
            <div v-if="isAppOwnerAndOnlyMySwitchAppIsOn">

                <b-button type="is-success" @click.prevent="saveChanges" v-if="packagesDetailsIsChanged">{{saveTextDefault}}</b-button>
            </div>
            <div class="card-title has-text-black-bis is-centered">
                <p v-if="!isAppOwnerAndOnlyMySwitchAppIsOn"> File name is {{ app.name }}</p>
                <input v-if="isAppOwnerAndOnlyMySwitchAppIsOn" v-model="pickedName" placeholder="app.name">
             </div>

             <div class="border-style">
              <b-form-file v-if="isAppOwnerAndOnlyMySwitchAppIsOn" ref="img-input"  @change="captureImg" placeholder="No Image chosen"/>
            </div>

            <ul class="list-group list-group-flush"> 

                
                <li class="list-group-item"><img :src="app.img"/></li>
                <li class="list-group-item has-text-black-bis" ><p> File last version {{ app.lastVersion }}</p></li>
                <!-- <li class="list-group-item"><p> Note: versions available are {{ app.versions}}</p></li> -->
            </ul>
            
            <!-- <template>
                <AppComponentButton :versionHashArgs="versionHashArgs" :app="app"></AppComponentButton>

            </template> -->
             <!-- <p> ipfs url for the app latest uploaded version is  {{ downloadApp }}</p> -->
             <!-- <p> Download <a v-if="fileLink" :href="''"> {{ fileLink }}</a> </p> -->
            <!-- <template v-if="!isFirstTime">
                <b-button  type="is-link"  @click.prevent="downloadAppFunction(app)">Go to IPFS link of {{ app.name }} version ( {{ app.lastVersion }} )</b-button>
            </template> -->

            <app-component-button :app="app" :packageIndex="packageIndex"></app-component-button>

            
            <div v-if="isAppOwnerAndOnlyMySwitchAppIsOn">
                <div>
                    <add-app-version :app="app"></add-app-version>
                    <app-versions :app="app"></app-versions>
                </div>
                <div>
                    <delete-app :app="app" :packageIndex="packageIndex"></delete-app>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script>
import { mapGetters } from 'vuex';
import ipfs from '../ipfs';

import hasura from '../hasura/hasuraHelper'

import AppComponentButton from './AppComponentButton';
import AddAppVersion from './AddAppVersion';
import AppVersions from './AppVersions';


import deleteApp from './deleteApp';

// import PackageStoreInstance from '../PackageStore';

export default {
    props: {
        app: {
            type: Object,
            default: () => ({})
        },

        onlyMyApps: false,

        packageIndex : 0
    },
    components: {
        AppComponentButton,

        AddAppVersion,
        AppVersions,
        deleteApp
    },

    methods: {


     init(){
        
        // this.versionHashArgs.methodArgs = [this.app.name, this.app.lastVersion];

        //console.log(`Initial arguments for index ${this.packageIndex} should be :${this.versionHashArgs.methodArgs}`);

        // this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.versionHashArgs);
         //console.log(`Registered arguments for calling contract ${versionHashArgs.contractName} Method ${versionHashArgs.method} Args ${this.app.name} and ${this.app.lastVersion}`);        


    },

    setFileHash() {

        //  this.fileHash = this.getContractData({ contract: versionHashArgs.contractName,
        //         method: versionHashArgs.method, methodArgs: versionHashArgs.methodArgs});
    },

    async saveChanges() {

        if(confirm("Are you sure you want to change app details?"))
        {

            if(this.pickedName != this.app.name && this.pickedImg != this.app.img){

                let imgHash = await this.sendImgToIPFS(this.pickedImg);

                if(typeof imgHash == "string" || imgHash instanceof String)
                {
                    
                    //let result =  this.drizzleInstance.contracts['PackageStore'].methods['changePackageName'].cacheSend(this.app.name, this.packageIndex, this.pickedName);

                    imgHash = this.app.img;

                    hasura.addAllPerformance(this.$apollo, 'name changed', this.app.name, hasura.getDate(), 12);

                    let result =  this.drizzleInstance.contracts['PackageStore'].methods['changePackageNameAndImage'].cacheSend(this.app.name, this.packageIndex, this.pickedName, imgHash, true, false);

                    this.app.name = this.pickedName;

                    alert("Saved name but Image has error");
                }else{

                    imgHash = imgHash[0].hash;

                    hasura.addAllPerformance(this.$apollo, 'name and image changed', this.app.name, hasura.getDate(), 12);

                    let result =  this.drizzleInstance.contracts['PackageStore'].methods['changePackageNameAndImage'].cacheSend(this.app.name, this.packageIndex, this.pickedName, imgHash, true, true);
                    this.app.name = this.pickedName;
                    this.app.img = this.pickedImg;
                }

            }else if(this.pickedName != this.app.name){
                

                hasura.addAllPerformance(this.$apollo, 'name changed', this.app.name, hasura.getDate(), 12);
                //let result =  this.drizzleInstance.contracts['PackageStore'].methods['changePackageName'].cacheSend(this.app.name, this.packageIndex, this.pickedName);
                let result =  this.drizzleInstance.contracts['PackageStore'].methods['changePackageNameAndImage'].cacheSend(this.app.name, this.packageIndex, this.pickedName, this.app.img, true, false);
                
            }else if(this.pickedImg != this.app.img){

                let imgHash = await this.sendImgToIPFS(this.pickedImg);

                if(typeof imgHash == "string" || imgHash instanceof String)
                {
                    alert("Image Error");

                }else{

                    imgHash = imgHash[0].hash;
                    hasura.addAllPerformance(this.$apollo, 'image changed', this.app.name, hasura.getDate(), 12);
                    //let result =  this.drizzleInstance.contracts['PackageStore'].methods['changeImage'].cacheSend(this.app.name, imgHash);
                    let result =  this.drizzleInstance.contracts['PackageStore'].methods['changePackageNameAndImage'].cacheSend(this.app.name, this.packageIndex, "", imgHash, false, true);
                }
            }

        this.app.name = this.pickedName;
        this.pickedImg = this.app.img;

        // console.log(`app image is ${this.app.img} and picked is ${this.pickedImg}`);

        }            
    },

    captureImg(img) {

        if (typeof img !== 'undefined' && img.target.files[0] != undefined) {
            if(img.target.files[0].name.substring(img.target.files[0].name.lastIndexOf('.') + 1) !== "jpeg"
            && img.target.files[0].name.substring(img.target.files[0].name.lastIndexOf('.') + 1) !== "jpg"
            && img.target.files[0].name.substring(img.target.files[0].name.lastIndexOf('.') + 1) !== "png")
            {
                alert ('The img isnt an jpeg or jpg or png file');

                this.$refs['img-input'].reset()
                // alert (file.target.files[0].name.substring(file.target.files[0].name.lastIndexOf('.') + 1));

            }else {
                const reader = new FileReader();

                reader.readAsArrayBuffer(img.target.files[0]);
                reader.onloadend = async () => {
                this.pickedImg = await this.convertToBuffer(reader.result);
                };
            }
        } else {

            this.pickedImg = this.app.img;
        }
    },

    async convertToBuffer(reader) {

        return await Buffer.from(reader);
    },

    async sendImgToIPFS(newAppImg){

        // alert(`Uploading on IPFS...   App Img : ${newAppImg}`);

        let result =  await ipfs.add(newAppImg);

        //console.log(`Received Image is ${result}`);


        // if(error){
                
        //     return `Error is ${error}`;
        // } 
        if(result){

            return result;
        }
        return "";
    },

    downloadAppFunction(app, version = app.lastVersion) {

            //First Way
            //  console.log(`Before First`);
            //  let cacheKey =   this.drizzleInstance.contracts['PackageStore'].methods['getPackageVersionHash'].cacheCall(app.name, version);
            //   console.log(`Before Second`);
            //  let cacheData =  this.contractInstances['PackageStore']['getPackageVersionHash'][''+cacheKey].value;
            //  const fileHash = cacheData;
            //  console.log(`Cache key is ${cacheKey}  
            //  && its value is ${cacheData} && fileHash is ${fileHash}`);
            
            
            //   ipfs.get(this.fileLink).then((result) => {
            
            //   if(result){
            
            //   console.log(`the result is ${result}`);

            // //   window.open(this.fileLink , '_blank');

            //   }

            // }).catch((err) => {

            //   console.log(`Error id ${err}`);

            // });      

           // console.log(ipfs.contract);
        // console.log(`file link is: ${this.fileLink}`)

        if(!this.fileLink)
        {

        this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.versionHashArgs); 
               
        this.fileHash =  this.getContractData({ contract: this.versionHashArgs.contractName,
        method: this.versionHashArgs.method, methodArgs: this.versionHashArgs.methodArgs});
        }

        window.open(`https://ipfs.io/ipfs/${this.fileHash}`, '_blank');
      }
    },

    computed:{
        
        ...mapGetters('drizzle', ['drizzleInstance']),

        ...mapGetters('contracts' , ['getContractData', 'contractInstances']),

        ...mapGetters('accounts', ['activeAccount', 'activeBalance']),

        isAppOwnerAndOnlyMySwitchAppIsOn(){

            // /console.log(`app.CanEdit is ${this.app.canEdit} && appOwner is ${this.app.appOwner} && Active Account is ${this.activeAccount} && onlyMyApps is ${this.onlyMyApps}`)
           
            // return (this.app.appOwner == this.activeAccount) && this.onlyMyApps;

             return (this.app.canEdit) && this.onlyMyApps;

        },

        doShowDiv(){

            if(this.onlyMyApps)
            {

                // return (this.app.appOwner == this.activeAccount);

                // console.log(`can edit is ${this.app.can}`)
                return (this.app.canEdit);
            }

            return true;
        },

        // fileLink(){

        //     //versionHashArgs.methodArgs = [this.app.name, this.app.lastVersion];


        //     if(this.app.name != '' && this.isFirstTime)
        //     {

        //         this.versionHashArgs.methodArgs = [this.app.name, this.app.lastVersion];

        //         //console.log(`Initial arguments for index ${this.packageIndex} should be :${this.versionHashArgs.methodArgs}`);

        //         this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.versionHashArgs); 
               
        //        // console.log(`The arguments for index ${this.packageIndex} should be :${this.versionHashArgs.methodArgs}`);

        //         this.fileHash =  this.getContractData({ contract: this.versionHashArgs.contractName,
        //         method: this.versionHashArgs.method, methodArgs: this.versionHashArgs.methodArgs});

        //         this.isFirstTime = false;

        //     }
            

        //     //  this.fileHash = await PackageStoreInstance.methods.getPackageVersionHash(this.app.name, this.app.lastVersion).call();


        //     if(this.fileHash === "loading" || this.fileHash == '' || !this.fileHash){
                
        //         //console.log(`still loading ${this.fileHash}`);

        //         // setTimeout(() => {

        //         // console.log(`setTimeout is running and this.fileHash is ${this.fileHash}`);
                
        //         //  this.setFileHash()
        //         // },4000);

        //         return false;
        //     }

        //      //console.log(`Button should be visible and filehash is :${this.fileHash}`);

        //     // console.log(`For index: ${this.packageIndex}: filehash is :${this.fileHash}`);

        //     this.isFirstTime = false;

        //     return this.fileHash;
        // },

        packagesDetailsIsChanged(){


            if(this.pickedName != this.app.name && this.pickedImg != this.app.img){
                
                this.saveTextDefault = "Save new Name and Image";

                return true;

            }else if(this.pickedName != this.app.name){
            

                this.saveTextDefault = "Save new Name";

                return true;

            }else if(this.pickedImg != this.app.img){

                this.saveTextDefault = "Save new Image";
                
                return true;
            }

            return false;
        }
      },


       mounted() {

           this.init();
      },

      created(){

      },

      watch: {
          fileLink: function(value){

              
          }
      },

      data :function (){

          return {
            isFirstTime: true,
            pickedName: this.app.name,
            pickedImg: this.app.img,
            saveTextDefault: "save",
            versionHashArgs: {
            contractName: 'PackageStore',
            method: 'getPackageVersionHash',
            methodArgs:['','']
            }
          }
    }
}
</script>