
<template>
  <div>
    <form class="margin-sm bg-warning">


            <div class="border-style">
              <b-form-text class="has-text-black-bis"> Available versions: {{ app.versions.replace(",",", ")}} </b-form-text>
            </div>

            <div class="border-style" >
              <b-form-text  type="is-link"> Note: Repetition is not allowed; Pick a new version </b-form-text>
            </div>


          <b-switch v-model="byLink">
          <Strong style="color: gray;"> (Off: by File) </Strong>  /  <Strong style="color: purple;">   (On: by Link) </Strong> 
            </b-switch>

            <div v-if="!byLink" class="border-style">
              <b-form-file ref="file-input"  @change="captureFile" />
            </div>
   
            <div v-else>
                <b-input placeholder="IPFS Link" v-model="ipfsLink" />
            </div>

            <div>
              <b-input-group prepend="Version" >

                <b-input  placeholder="Example: 1.1.2" v-model="version"  />

              </b-input-group>
            </div>

             <b-button type="is-primary" @click.prevent="handleOk"> add a new version</b-button>

      </form>

    </div>
</template>

<script>

import { mapGetters } from 'vuex';

import ipfs from '../ipfs';

import hasura from '../hasura/hasuraHelper'


// import { version } from 'punycode';

export default {
/* eslint-disable */

      props: {
        app: {
            type: Object,
            default: () => ({})
        }
    },

    methods: {

      init() {
                                

      },

      captureFile(file) {
              
        if (typeof file !== 'undefined') {
       // if(file.target.files[0].name.substring(file.target.files[0].name.lastIndexOf('.') + 1) !== "ipa")
       if(false)
          {
            alert ('The file isnt an IPA file');

            this.$refs['file-input'].reset()
                  // alert (file.target.files[0].name.substring(file.target.files[0].name.lastIndexOf('.') + 1));

          }else {

            const reader = new FileReader();

            if (typeof file !== 'undefined') {
                  
                    //this.fileName = file.target.files[0].name.replace(/(.*)\.(.*?)$/, "$1");
              this.fullFileName = file.target.files[0].name;

              reader.readAsArrayBuffer(file.target.files[0]);
              reader.onloadend = async () => {
              this.fileBuffer = await this.convertToBuffer(reader.result);
              };
            } 
          }
        }else this.fileBuffer = '';
              
       },

      async convertToBuffer(reader) {
            
        return await Buffer.from(reader);
      },

      handleOk() {

        if(!this.byLink)
        {

          if (!this.fileBuffer || !this.version) {
          alert('Please upload a file and type its version atleast');
          } else {
            this.onSubmit();
          }
        }
         else{
            
            if(this.ipfsLink.lastIndexOf('/') == (this.ipfsLink.length - 1)){

              this.ipfsLink = this.ipfsLink.substr(0, this.ipfsLink.lastIndexOf('/'));
              //alert(`Link is ${this.ipfsLink}`);
            }

            if (!this.version) {

              alert('Please type the file version');
            }
            else if(!this.ipfsLink.includes('https://ipfs.io/ipfs'))
            {
              alert("Pleas enter a link that contains 'https://ipfs.io/ipfs'");
            }
            else if((this.ipfsLink.substr(this.ipfsLink.lastIndexOf('/') + 1).length < 45))
            {

              alert("Please enter a link with a valid hash");
            }
            else{

              // alert(`String length is ${this.ipfsLink.substr(this.ipfsLink.lastIndexOf('/') + 1).length}`)
              this.onSubmit();
            }
          }

      },

         onSubmit(){

            //alert(`Uploading on IPFS... with file Buffer: ${this.fileBuffer} & Img Buffer: ${this.imgBuffer}`);

            alert(`Uploading to IPFS ... Please Wait`);

            this.saveToIpfsWithFilename();
          },

      async saveToIpfsWithFilename() {

          //const file = [...files][0]
        let fileHash;


        if(!this.byLink){
          
             let file = this.fileBuffer;

        const fileDetails = {
          path: this.fullFileName,
          content: file
      }
        const options = {
          wrapWithDirectory: true,
          progress: (prog) => console.log(`received: ${prog}`)
        }

        this.$Progress.start()

        ipfs.add(fileDetails, options)
          .then((hashedFiles) => {

          this.$Progress.finish()
  
          alert(' *** Finished Uploading on IPFS...');
              //console.log(`The response is ${hashedFiles[0]} and ${hashedFiles[1]}`);
              // CID of wrapping directory is returned last
          fileHash = hashedFiles[hashedFiles.length - 1].hash;

          try{
                  
            if(!this.versionIsNew(this.app.versions))
            {
              throw "Error: check the version and app details, and try later";
            }


                  //console.log(`AddAppVersion Transaction send with _fileName: ${this.fileName} and version: ${this.version} and fileHash: ${fileHash}`);
          
          this.$Progress.finish()

          //hasura.addAllPerformance(this.$apollo, this.version, this.fileName, hasura.getDate(), 11);
          // hasura.addNewVersionPerformanceToHasura(this.$apollo, this.version, this.fileName, '', hasura.getDate(), 11);

          let result = this.drizzleInstance.contracts['PackageStore'].methods['addNewVersion'].cacheSend(fileHash, this.fileName, this.version, new Date().getTime());    
                   
          }
          catch(err){

            this.$Progress.fail();
            alert(' *** IPFS Error...');
            //alert(err);
            console.log(err);
          }
                    
              // ipfs.content.tostring();
              // this.setState({ added_file_hash: ipfsId })
        }).catch((err) => {
              console.error(err)
        });
        }
        else{
           try{
            
            fileHash = this.ipfsLink.substr(this.ipfsLink.lastIndexOf('/') + 1);
            //alert(`fileHash is ${fileHash}`);

            alert(`AddAppVersion Transaction send with _fileName: ${this.fileName} and version: ${this.version} and fileHash: ${fileHash}`);

            if(!this.versionIsNew(this.app.versions))
            {
              throw "Error: check the version and app details, and try later";
            }


                  //console.log(`AddAppVersion Transaction send with _fileName: ${this.fileName} and version: ${this.version} and fileHash: ${fileHash}`);
          
          this.$Progress.finish()

           //hasura.addAllPerformance(this.$apollo, this.version, this.fileName, hasura.getDate(), 11);
          // hasura.addNewVersionPerformanceToHasura(this.$apollo, this.version, this.fileName, '', hasura.getDate(), 11);

          let result = this.drizzleInstance.contracts['PackageStore'].methods['addNewVersion'].cacheSend(fileHash, this.fileName, this.version, new Date().getTime());    
                   
          }
          catch(err){

            this.$Progress.fail();
            alert(' *** IPFS Error...');
            //alert(err);
            console.log(err);
          }
        }       
      },

      versionIsNew(versionsString){
        

        let versions = versionsString.split(",");

        for(let i = 0; i < versions.length; i++){

          versions[i] = versions[i].substring(3);
          if(this.version == versions[i]){

            return false;
          }

          return true;
        }

      }
    },

        computed: {

        ...mapGetters('drizzle', ['drizzleInstance']),

        //...mapGetters('contracts' , ['getContractData', 'contractInstances']),

    },

    data: function() {

      return { fileBuffer: '',
              version: '',
              fileName: this.app.name,
              fullFileName: '',
              byLink: false,
              ipfsLink: ''
      
            }
    },

    mounted() {

          this.init();
        }
}
</script>

<style>

</style>