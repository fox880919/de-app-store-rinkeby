<template>

    <div>
        <div >
        <label style ="line-height: 40px;  margin-top: 30px; margin-right: 20px; background-color: #e7e7e7;"> Version: {{ version }}  </label>   
            <b-button  style ="line-height: 10px; margin-top: 30px;" type="is-danger"  @click.prevent="deleteApp">  Delete Version</b-button>
        </div>

        <!-- <template v-if="fileLink">
            <b-button class="is-link" v-if="app.lastVersion != version" @click.prevent="downloadVersion()" > Go to IPFS link of this app version {{ version }}</b-button>
        </template> -->

        <b-button class="is-link" v-if="app.lastVersion != version" @click.prevent="downloadVersion()" > Go to IPFS link of this app version {{ version }}</b-button>

    </div>

</template>

<script>
/* eslint-disable */

import { mapGetters } from 'vuex';

import ipfs from '../ipfs'; 

import hasura from '../hasura/hasuraHelper'

export default {

    props: {
        app: {
            type: Object,
            default: () => ({})
        },

         versions: {
            type: Array,
        },

        index: 0,

        version: ''
    },

    methods: {

          init(){

         this.versionHashArgs.methodArgs = [this.app.name, this.version];
        //  console.log(`calling contract ${versionHashArgs.contractName} Method ${versionHashArgs.method} Args ${this.app.name} and ${this.app.lastVersion}`);        

         this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.versionHashArgs);
    },

        deleteApp(){

            if(this.versions.length == 1)
            {

                alert("You can't delete the last available version. But you can delete the whole app");
                // if(confirm("This is the only version you have. Are you sure?"))
                // {
                //     let result =  this.drizzleInstance.contracts['PackageStore'].methods['deleteAPackageVersion'].cacheSend(this.app.name, this.version, this.index);

                //     alert("Delete is done");
                // }

            }
            else{

                    hasura.addAllPerformance(this.$apollo, this.version, this.app.name, hasura.getDate(), 14);

                    // hasura.addWithExistingAppPerformanceToHasura(this.$apollo, this.version, this.app.name, hasura.getDate(), 14);

                    let result =  this.drizzleInstance.contracts['PackageStore'].methods['deleteAPackageVersion'].cacheSend(this.app.name, this.version, this.index);

                    alert("Delete is done");
                }
        },

        async downloadVersion(){
        
         this.versionHashArgs.methodArgs = [this.app.name, this.version];


        this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.versionHashArgs); 
        // console.log(`The arguments for index ${this.packageIndex} should be :${this.versionHashArgs.methodArgs}`);

        this.fileHash =  this.getContractData({ contract: this.versionHashArgs.contractName,
        method: this.versionHashArgs.method, methodArgs: this.versionHashArgs.methodArgs});
        // console.log(`file link is: ${this.fileLink}`)

        while(this.fileHash == 'loading' || this.fileHash == null){

        console.log(`Initial arguments for index ${this.index} should be :${this.versionHashArgs.methodArgs}`);

            await this.sleep(100);
        }

        window.open(`https://ipfs.io/ipfs/${this.fileHash}`, '_blank');
      },

      async sleep(ms){
       
        this.count = this.count + 1;
        return await new Promise(resolve => setTimeout(resolve, ms));
      }
    },

    computed:{
        
        ...mapGetters('drizzle', ['drizzleInstance']),

        ...mapGetters('contracts' , ['getContractData', 'contractInstances']),

        fileLink(){

            //versionHashArgs.methodArgs = [this.app.name, this.app.lastVersion];

            if(this.app.name != '')
            {

                this.versionHashArgs.methodArgs = [this.app.name, this.version];

                // console.log(`Initial arguments for index ${this.packageIndex} should be :${this.versionHashArgs.methodArgs}`);

                this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.versionHashArgs); 
                console.log(`The arguments for index ${this.packageIndex} should be :${this.versionHashArgs.methodArgs}`);

                this.fileHash =  this.getContractData({ contract: this.versionHashArgs.contractName,
                method: this.versionHashArgs.method, methodArgs: this.versionHashArgs.methodArgs});
            }
            

            //  this.fileHash = await PackageStoreInstance.methods.getPackageVersionHash(this.app.name, this.app.lastVersion).call();


            if(this.fileHash === "loading" || this.fileHash == '' || !this.fileHash){

                return false;
            }

             //console.log(`Button should be visible and filehash is :${this.fileHash}`);

            // console.log(`For version index: ${this.index}: filehash is :${this.fileHash}`);

            return true;
        },

    },

    data: function(){

        return{
            fileHash: '',
            isFirstTime: true,
            versionHashArgs: {
            contractName: 'PackageStore',
            method: 'getPackageVersionHash',
            methodArgs:['','']
            }
        }
    },

    
    // created(){

    //     this.versionHashArgs.methodArgs = [this.app.name, this.app.version];
        
    //     this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.versionHashArgs);
    // },

    mounted() {

        this.init();
    },

    //  watch: {
    //       fileLink: function(value){

              
    //       }
    //   },

}
</script>

<style>

</style>