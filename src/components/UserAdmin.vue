<template>
  <div>

    <br>
    <br>
    <drizzle-contract contractName="PackageStore" method="getAdminsCount" label="Stores Admin:" />

    <div v-if="countArray.length > 0">
                
        <div v-for="(admin, i) in countArray" :key="i">

          <!-- <div> {{allAdmins}}</div> -->

            <control-get-admin :admin="allAdmins[i]" :index="i"></control-get-admin>
        </div>
    
    </div>
    
    <br> 
    <br> 
    
    <div> Add an admin </div>

    <drizzle-contract-form
      contractName="PackageStore"
      method="addAnAdmin"
      :placeholders="['Value']"
    />  

  </div>


    
</template>

<script>
/* eslint-disable */

 import ControlGetAdmin from './ControlGetAdmin';

const AdminCountsArgs = {
    contractName: 'PackageStore',
    method: 'getAdminsCount',
    methodArgs:''
};

const  getAdminArgs = {
  contractName: 'PackageStore',
  method: 'getAdmin',
  methodArgs:'0'
};


import { mapGetters } from 'vuex';
// import func from '../../vue-temp/vue-editor-bridge';

export default {

    components: {

        ControlGetAdmin
    },

    computed: {

        ...mapGetters('drizzle', ['isDrizzleInitialized']),
        
        ...mapGetters('contracts' , ['getContractData', 'contractInstances']),


        countArray(){

            let value = 0;
            
            value = this.getContractData({ contract: AdminCountsArgs.contractName, method: AdminCountsArgs.method });

             this.tempArray = [];

            for (let i = 0; i < value; i++){
              
              this.tempArray.push(i);
            }

            return this.tempArray;
        },

         allAdmins(){

            // getAdminArgs.methodArgs = this.adminIndex+"";

           // console.log(`this index is ${this.adminIndex}`);

            let admins = [];

            for(let i = 0; i < this.countArray.length; i++)
                { 
                  //let test1 = this.drizzleInstance.contracts['PackageStore'].methods['getPackageName'].cacheCall(i);

                  getAdminArgs.methodArgs = (""+ i);   
                  
                  this.$store.dispatch('drizzle/REGISTER_CONTRACT', getAdminArgs);

                  let admin = this.getContractData({ contract: getAdminArgs.contractName, method: getAdminArgs.method, methodArgs: this.adminIndex+""});

                  admins.push(admin);
                }

                console.log(` admins are ${admins}`);
                return admins;
        },


  },

  created(){

    this.$store.dispatch('drizzle/REGISTER_CONTRACT', AdminCountsArgs);
  },

  data: function() {

    return {

      tempArray: [],
      
    }
  }

}
</script>

<style>

</style>