<template>
    <div> 
        <br>
        <strong style="color:blue;">admin #{{index + 1}} address is</strong>  <pre> {{ admin }}  </pre>

        <b-button  style ="line-height: 10px; margin-top: 30px;" type="is-danger"  @click.prevent="removeAdmin">Remove Admin #{{index + 1}}</b-button>

        <br>
    </div>
</template>


<script>
import { mapGetters } from 'vuex';
import { stringify } from 'querystring';

// let getAdminArgs = {
//  contractName: 'PackageStore',
//     method: 'getAdmin',
//     methodArgs:'0'
// }
export default {

    props: {

        admin: String,

        index: 0
    },

    computed: {

       ...mapGetters('drizzle', ['drizzleInstance']),

       ...mapGetters('contracts' , ['getContractData']),
  
        // adminData(){

        //     // getAdminArgs.methodArgs = this.adminIndex+"";

        //    // console.log(`this index is ${this.adminIndex}`);

        //     let result;

        //      console.log(`Before first if the result is ${result}`);

            
        //      if(!this.result && this.isFirstTime)
        //     {
                
        //         console.log(`After first if the result is ${result}`);

        //         this.getAdminArgs.methodArgs = this.adminIndex+"";

        //         this.$store.dispatch('drizzle/REGISTER_CONTRACT', this.getAdminArgs);



        //         this.result = this.getContractData({ contract: this.getAdminArgs.contractName, method: this.getAdminArgs.method, methodArgs: this.adminIndex+""});
        //     }

        //     //console.log(result);
            
        //     if(this.result === "loading" || this.result == '' || !this.result || this.result == null || typeof this.result === "undefined"){
                
        //         console.log(`before second if the result is ${this.result}`);

        //         // setTimeout(function () {

        //         //     this.result = this.getContractData({ contract: this.getAdminArgs.contractName, method: this.getAdminArgs.method, methodArgs: this.adminIndex+""});

        //         //      console.log(this.result);
        //         //  }, 2000);

        //         return false;
        //     }

        //     console.log(`after second if the result is ${this.result}`);

        //     this.isFirstTime = false;

        //     result = this.result

        //     return result;
        // },

        // getResult(){

        // //     if(this.adminData)
        // //     {
                
        // //         return this.result;
        // //     }

        //        // return this.adminData();

        // }

    },

    methods:{

        removeAdmin(){

            let result =  this.drizzleInstance.contracts['PackageStore'].methods['removeAnAdmin'].cacheSend(this.index);

            alert("Removing admin transaction is sent");
        }
    },

    data: function(){

        return{
            result: false,
            isFirstTime: true,
            getAdminArgs: {
            contractName: 'PackageStore',
            method: 'getAdmin',
            methodArgs:'0'
            }
        }
    },

    mounted(){

        // this.getAdminArgs.methodArgs = this.adminIndex+"";

        // this.$store.dispatch('drizzle/REGISTER_CONTRACT', this.getAdminArgs);
  }
}
</script>

<style>

</style>