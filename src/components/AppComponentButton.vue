<template>

                <!-- <b-button  v-if="fileLink" type="is-link"  @click.prevent="downloadAppFunction(app)">Go to IPFS link of {{ app.name }} version ( {{ app.lastVersion }} )</b-button> -->
                <b-button type="is-link"  @click.prevent="downloadAppFunction(app)">Go to IPFS link of {{ app.name }} version ( {{ app.lastVersion }} )</b-button>

</template>

<script>
import { mapGetters } from 'vuex';
import ipfs from '../ipfs';

export default {
 props: {
        app: {
            type: Object,
            default: () => ({})
        },

        packageIndex : 0
 },

 methods: {

     async downloadAppFunction(app, version = app.lastVersion) {

        // if(!this.fileLink)
        // {

        // // this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.versionHashArgs); 
               
        // // this.fileHash =  this.getContractData({ contract: this.versionHashArgs.contractName,
        // // method: this.versionHashArgs.method, methodArgs: this.versionHashArgs.methodArgs});

        // //  ipfs.get(this.fileHash, function (err, file) {
        // //     // files.forEach((file) => {
        // //         console.log(file.path)
        // //         console.log("File content >> ",file.content.toString('utf8'))
        // //     // })
        // // })
        // }
        this.versionHashArgs.methodArgs = [this.app.name, this.app.lastVersion];
        
        this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.versionHashArgs);

        this.fileHash =  this.getContractData({ contract: this.versionHashArgs.contractName,
                method: this.versionHashArgs.method, methodArgs: this.versionHashArgs.methodArgs});

        while(this.fileHash == 'loading' || this.fileHash == null){

        console.log(`Initial arguments for index ${this.packageIndex} should be :${this.versionHashArgs.methodArgs}`);

            await this.sleep(100);
        }
       
        window.open(`https://ipfs.io/ipfs/${this.fileHash}/`, '_blank');

        // window.open(`https://ipfs.io/ipfs/${this.fileHash}/${app.name}`, '_blank');
      },

    async sleep(ms){
       
        this.count = this.count + 1;
        return await new Promise(resolve => setTimeout(resolve, ms));
      }
    },

    computed: {

        ...mapGetters('drizzle', ['drizzleInstance']),

        ...mapGetters('contracts' , ['getContractData', 'contractInstances']),

        fileLink(){

            //versionHashArgs.methodArgs = [this.app.name, this.app.lastVersion];

            // if(this.isFirstTime == false)
            // {
            //     return true;
            // }
            // if(this.app.name != '' && this.isFirstTime)
            if(this.app.name != '')
            {
               
               // console.log(`The arguments for index ${this.packageIndex} should be :${this.versionHashArgs.methodArgs}`);
                if(this.isFirstTime){


                // console.log(`Initial arguments for index ${this.packageIndex} should be :${this.versionHashArgs.methodArgs}`);


                this.fileHash =  this.getContractData({ contract: this.versionHashArgs.contractName,
                method: this.versionHashArgs.method, methodArgs: this.versionHashArgs.methodArgs});

                if(this.fileHash === "loading"){
                    
                    // if(this.count < 26)
                    // {

                    //     await this.sleep(100);
                    // }
                    return false;
                }

                return true;
                }
            }
            

            //  this.fileHash = await PackageStoreInstance.methods.getPackageVersionHash(this.app.name, this.app.lastVersion).call();
            // if(this.count < 26)
            // {

            //     await this.sleep(1000);
            // }

            // if(this.fileHash === "loading" || this.fileHash == '' || !this.fileHash){
                
            //     //console.log(`still loading ${this.fileHash}`);

            //     // setTimeout(() => {

            //     // console.log(`setTimeout is running and this.fileHash is ${this.fileHash}`);
                
            //     //  this.setFileHash()
            //     // },4000);

            //     return false;
            // }

             //console.log(`Button should be visible and filehash is :${this.fileHash}`);

            // console.log(`For index: ${this.packageIndex}: filehash is :${this.fileHash}`);

        }
    },

    created(){

        this.versionHashArgs.methodArgs = [this.app.name, this.app.lastVersion];
        
        this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.versionHashArgs);
    },

    data :function (){

          return {
            
            fileHash: '',
            versionHashArgs: {
            contractName: 'PackageStore',
            method: 'getPackageVersionHash',
            methodArgs:['','']
            },
            isFirstTime: true,
            count: 1
          }
    }
}
</script>

<style>

</style>