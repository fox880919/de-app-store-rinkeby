<template>
    <div>
        <div v-if="myPackage">
                
            <app-component :app="componentApp" :packageIndex="index" :onlyMyApps="onlyMyApps" margin-top="100px" class="column is-10-widescreen"></app-component>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex';
import AppComponent from './AppComponent';


 

export default {

    props: {

        index: 0,
        onlyMyApps: false,
    },

    components: {
    AppComponent,
  },

    methods: {

        // downloadPackage(){

        //     console.log(`appsCount is: ${this.appsCount}`);

        //     packagesArgs.methodArgs = (""+ i);

        //     //console.log(`calling contract ${packagesArgs.contractName} Method ${packagesArgs.method} Args ${packagesArgs.methodArgs }`);        

        //     this.$store.dispatch('drizzle/REGISTER_CONTRACT',packagesArgs);

        //     // this.$store.dispatch('drizzle/REGISTER_CONTRACT',packagesArgs);


        //     let app = this.getContractData({ contract: packagesArgs.contractName, method: packagesArgs.method, methodArgs: packagesArgs.methodArgs });

        //     this.componentApp = ({name: app[0], img: `https://ipfs.io/ipfs/${app[1]}`, versions: app[2], lastVersion: app[3], canEdit: app[4], appOwner: app[5]});
            
        //     console.log()
        //     return this.componentApp;
        // },
    },

    computed:{

        ...mapGetters('drizzle', ['drizzleInstance']),

         ...mapGetters('contracts' , ['getContractData', 'contractInstances']),

         myPackage(){
             
             if(this.finishedLoading == true)
             {
                 return this.componentApp;
             }

            // this.$store.dispatch('drizzle/REGISTER_CONTRACT',packagesArgs);

            //console.log(`inside Applications Components with index ${this.packagesArgs.methodArgs}`);

            let app = this.getContractData({ contract: this.packagesArgs.contractName, method: this.packagesArgs.method, methodArgs: this.packagesArgs.methodArgs });

            if(!app)
            {
                return false;
            }

            else{

                this.componentApp = ({name: app[0], img: `https://ipfs.io/ipfs/${app[1]}`, versions: app[2], lastVersion: app[3], canEdit: app[4], appOwner: app[5]});
            }

            if(this.componentApp.name == null)
            {
            
            //console.log ("return false for null");

                // console.log (`Component app with no app name`);

                return false;
            }

            else if (this.componentApp.name === 'l' || this.componentApp.name.length < 2)
            {
            
                // console.log (`Component app with no length`);

            //console.log ("return false generally");


            return false;
            }
            
            // console.log (`Component app name is ${this.componentApp.name}`);
            this.finishedLoading = true;
            return true
        },
    },

    mounted(){
        
        //console.log(`inside Mounted of Applications Components with index ${this.index}`);

         this.packagesArgs.methodArgs = (""+ this.index);

        // console.log(`calling contract ${this.packagesArgs.contractName} Method ${this.packagesArgs.method} Args ${this.packagesArgs.methodArgs }`);        

        this.$store.dispatch('drizzle/REGISTER_CONTRACT',this.packagesArgs);
    },

    data: () => ({

        finishedLoading: false,
        componentApp: null,
        packagesArgs: {
        contractName: 'PackageStore',
        method: 'getPackageInfo',
        methodArgs:'0'
        }
    })
}
</script>

<style>

</style>