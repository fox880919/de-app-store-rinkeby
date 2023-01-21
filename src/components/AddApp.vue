<template>
  <div id="addApp">
    <form class="margin-sm" style="background-color: #EAF2F8">

          <b-switch v-model="byLink">
          <Strong style="color: gray;"> (Off: by File) </Strong>  /  <Strong style="color: purple;">   (On: by Link) </Strong> 
            </b-switch>

            <div v-if="!byLink" class="border-style">
              <b-form-file ref="file-input"  @change="captureFile"  />
            </div>
   
            <div v-else>
                <b-input placeholder="IPFS Link" v-model="ipfsLink" />
            </div>


            <div  class="border-style">
              <b-form-file ref="img-input"  @change="captureImg" placeholder="No Image chosen"/>
            </div>


            <div class="border-style">
              <b-input-group prepend="App Name" >
                <b-input placeholder="Application Name" v-model="fileName" />
              </b-input-group>
            </div>

            <div class="border-style is-centered ">
              <b-input-group prepend="Version" >
                <b-input class="is-centered" placeholder="Example: 1.1.2" v-model="version" />
              </b-input-group>
            </div>

            <b-button
              class="margin-xs"
              variant="secondary"
              @click="handleOk"
            >
              Upload
            </b-button>
      </form>

   </div>
</template>

<script>

import { mapGetters } from 'vuex';

import ipfs from '../ipfs';

import gql from 'graphql-tag';

import hasura from '../hasura/hasuraHelper'

// import {INSERT_APP_DETAILS_MUTATION} from '../my-queries/my-mutation-queries';


const INSERT_STORE_PERFORMANCE_MUTATION = gql`mutation ($version: String!, $name: name!, $image: String!, $start_date: time!, $operationId: Int!){
                insert_store_performance  (
                    objects:[
                    {
                        start_date: $start_date,
                        consensus_type_id: 1
                        operation_id: $operationId

                        version_detail: {
                          data:{

                            version: $version
                            
                            app_detail: {
                              
                              data:{

                                name: $name,
                                image: $image,
                                consensus_type_id: 1

                              }
                            }
                          }
                        }

                     }
                    ])
                    {
                        affected_rows
                    }
                }`;


export default {

/* eslint-disable */

name: "addApp",

    computed: {
        ...mapGetters('drizzle', ['drizzleInstance'])
    },

    methods: {

           /* used to catch chosen image &
     * convert it to ArrayBuffer.
     */
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
                  
                    this.fullFileName = file.target.files[0].name;

                    this.fileName = file.target.files[0].name.replace(/(.*)\.(.*?)$/, "$1");

                    reader.readAsArrayBuffer(file.target.files[0]);
                    reader.onloadend = async () => {

                      
                    this.fileBuffer = await this.convertToBuffer(reader.result);
                    };
                  } 
                }
              }else this.fileBuffer = '';
              
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
                      this.imgBuffer = await this.convertToBuffer(reader.result);
                      };
                  }
               } else this.imgBuffer = '';
            },

            /**
             * converts ArrayBuffer to
             * Buffer for IPFS upload.
             */
            async convertToBuffer(reader) {
            
            return await Buffer.from(reader);
            },

         onSubmit(){


          this.saveToIpfsWithFilename();     
        },

        handleOk() {

          if(!this.byLink)
          {
            
            if (!this.fileBuffer || !this.version) {

              alert('Please upload a file and type its version atleast');
            }else if(this.fileName.length < 4){
                
              alert('Choose a file with at least four characters name');
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

        saveToIpfsWithFilename() {

          //const file = [...files][0]
          let fileHash, imgHash;

          // console.log(`file name is ${this.fileName}`);

          let myProgress = this.$Progress;

          let currentProgressValue = 0;

          if(!this.byLink){
            
            alert(`Uploading to IPFS ... Please Wait`);

            let file = this.fileBuffer;
            const fileDetails = {
            path: this.fullFileName,
            content: file
          }

          const options = {
            wrapWithDirectory: true,
            progress: (prog) => { 

              console.log(`received: ${prog}`)
              myProgress.increase(prog - currentProgressValue);

              currentProgressValue = prog;
            },
            // progress: (prog) => {myProgress.increase();}
          }

          this.$Progress.start()

          ipfs.add(fileDetails, options)
            .then((hashedFiles) => {
              // console.log(`The response is ${hashedFiles[0]} and ${hashedFiles[1]}`);
              // console.log(`added files to ipfs is ${fileDetails.path}`);
              // CID of wrapping directory is returned last
              fileHash = hashedFiles[hashedFiles.length - 1].hash;

              currentProgressValue = 0;

               ipfs.add(this.imgBuffer, options).then(async (hashedImg) => {

                        imgHash = hashedImg[0].hash;
                        //console.log(`HashedImg is ${hashedImg}`);

                        try{
                          
                        //  await hasura.addAllPerformance(this.$apollo, this.version, this.fileName, hasura.getDate(), 10);
                         // hasura.addPerformanceToHasura(this.$apollo, this.version, this.fileName, `https://ipfs.io/ipfs/${imgHash}`, hasura.getDate(), 10);

                          let result =  this.drizzleInstance.contracts['PackageStore'].methods['addNewPackage'].cacheSend(fileHash, imgHash, this.fileName, this.version, new Date().getTime());
                          console.log(`Test is: ${result}`)

                          this.$Progress.finish();
                          alert(' *** Finished Uploading on IPFS...');
                        }
                        catch(err)
                        {
                          myProgress.fail();
                          alert('Uploading image to IPFS failed');
                          currentProgressValue = 0;
                          //alert(err.reason);
                          console.log(err.reason);
                        }
                    });
                    
              // ipfs.content.tostring();
              // this.setState({ added_file_hash: ipfsId })
            }).catch((err) => {
              myProgress.fail();
              currentProgressValue = 0;
              
              alert('Uploading file to IPFS failed');
              console.error(err)
            });
          }
          else{
              
              alert(`Starting Transaction ... Please Wait`);

              fileHash = this.ipfsLink.substr(this.ipfsLink.lastIndexOf('/') + 1);

               ipfs.add(this.imgBuffer).then(async (hashedImg) => {

                        imgHash = hashedImg[0].hash;
                        //console.log(`HashedImg is ${hashedImg}`);

                        try{
                          
                          // await hasura.addAllPerformance(this.$apollo, this.version, this.fileName, hasura.getDate(), 10);
                         // hasura.addPerformanceToHasura(this.$apollo, this.version, this.fileName, `https://ipfs.io/ipfs/${imgHash}`, hasura.getDate(), 10);

                          let result =  this.drizzleInstance.contracts['PackageStore'].methods['addNewPackage'].cacheSend(fileHash, imgHash, this.fileName, this.version, new Date().getTime());
                          console.log(`Test is: ${result}`)

                          myProgress.finish()
                          alert(' *** Finished transaction...');
                        }
                        catch(err)
                        {
                          myProgress.fail();
                          alert(' *** IPFS Error...');

                          //alert(err.reason);
                          console.log(err.reason);
                        }
                    });
                    

          }

          
        },

        addPerformanceToHasura(version, appName, image, start_date, operation_id){

          try {
                console.log(`Hasura data are version: ${version}, appName: ${appName}, image: ${image}, and start_date: ${start_date}`);

                const result = this.$apollo.mutate({

                    mutation: INSERT_STORE_PERFORMANCE_MUTATION,

                    variables: {
                        
                        version: version,
                        name: appName,
                        image: image,
                        start_date: start_date,
                        operationId: operation_id
                    },

                    error(error){

                        this.mutationError = error;
                        console.log(`Hasura error is ${JSON.stringify(error)}`);
                    }
                 });
          }
          catch(error){

            console.log(`Adding to Hasura error is ${error}`);
          }
        },

        getDate(){

          const today = new Date();
          const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          const dateTime = date+' '+time;

          return dateTime;
        }
    },

    data: () => ({
      fileBuffer: '',
      imgBuffer: '',
      version: '',
      fileName: '',
      fullFileName: '',
      mutationError:null,
      byLink: false,
      ipfsLink: ''
      
    })
}
</script>