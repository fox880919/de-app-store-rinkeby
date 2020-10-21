<template>
  
  <applications v-if="appsCount" :appsCount="appsCount" :countArray="getCountArray()"> </applications>
</template>

<script>

import applications from './Applications'

const countArgs = {
    contractName: 'PackageStore',
    method: 'getPackagescount',
    methodArgs: ''
}

import { mapGetters } from 'vuex';


export default {

    components:{

        applications
    },
    
    computed:{

    ...mapGetters('drizzle', ['drizzleInstance']),

    ...mapGetters('contracts' , ['getContractData', 'contractInstances']),

    appsCount(){
      
        this.count = this.getContractData({ contract: countArgs.contractName, method: countArgs.method });
        if (this.count === "loading") return false;
        //console.log(`App count is ${count}`);
        
            // console.log(`the count is ${this.count}`)
        return this.count;
    },

    },
    
    created(){

        this.$store.dispatch('drizzle/REGISTER_CONTRACT', countArgs);

    },  

    mounted(){

    this.count = this.getContractData({ contract: countArgs.contractName, method: countArgs.method });
    //   if (this.count === "loading") 
    //   return false;
      //console.log(`App count is ${count}`);
    
    // console.log(`the count is ${this.count}`)
    //   return this.count;
    },

    methods: {

        getCountArray(){

            let array = [];
            for (let i = 0; i < this.count; i++)
            {
                array.push(i);
            }

            return array;
        }
    },

    data: function (){

        return{

            count: 0
        } 
    }
}
</script>

<style>

</style>