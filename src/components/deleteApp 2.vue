<template>
  <b-button type="is-danger" @click.prevent="deleteApp"> Delete App</b-button>
</template>

<script>

import { mapGetters } from 'vuex';

/* eslint-disable */

import Vue from "vue"
import VuejsDialog from 'vuejs-dialog'

import hasura from '../hasura/hasuraHelper'


export default { 

    props: {
        app: {
            type: Object,
            default: () => ({})
        },
        
        packageIndex: 0

    },

    methods:{


        deleteApp(){

            if(confirm("Are you sure?"))
             {

                hasura.addAllPerformance(this.$apollo, 'deleted all', this.app.name, hasura.getDate(), 13);

                // hasura.addWithExistingAppPerformanceToHasura(this.$apollo, this.app.name + " delete all", this.app.name, hasura.getDate(), 13);

                console.log(`Deleting app with name: ${this.app.name}, PackageIndex: ${this.packageIndex}`);

                let result =  this.drizzleInstance.contracts['PackageStore'].methods['deleteAPackage'].cacheSend(this.app.name, this.packageIndex);
             }  

            //this.drizzleInstance.contracts['PackageStore'].methods['deleteAPackage'].cacheSend(this.app.name, this.packageIndex);

            // Vue.use(VuejsDialog, {
            //     message: 'Please confirm action'
            // });
            // Vue.dialog
            // .confirm(`Are you sure about deleting the following app: ${app.name}`)
            // .then(function(dialog) {

            //     this.delete();
            //     alert("Delete is done");
            // })
            // .catch(function(err) {
            //     console.log(`Error is ${err}`);
            // });
        },
    },

    computed: {

        ...mapGetters('drizzle', ['drizzleInstance']),

        //...mapGetters('contracts' , ['getContractData', 'contractInstances']),

    },

}
</script>

<style>

</style>