<template>
  <div>

    <input v-model="editableVersion" placeholder="app.name">
    <b-button  type="is-link"  @click.prevent="changeVersion">Save new version</b-button>
  </div>
</template>

<script>
/* eslint-disable */


import { mapGetters } from 'vuex';

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

        version: ''
    },

    methods: {

        changeVersion(){

            if(this.versions.includes(this.editableVersion))
            {

                alert("Version is already available. Choose another version");
            }else
            {   
                hasura.addAllPerformance(this.$apollo, 'edited', this.app.name, hasura.getDate(), 12);
        //   hasura.addWithExistingAppPerformanceToHasura(this.$apollo, this.editableVersion, this.app.name, hasura.getDate(), 12);
                let result =  this.drizzleInstance.contracts['PackageStore'].methods['editPackageVersion'].cacheSend(this.app.name, this.editableVersion, new Date().getTime());

                alert("Version changed");
            }
        }
    },

    computed:{
        
        ...mapGetters('drizzle', ['drizzleInstance']),

        ...mapGetters('contracts' , ['getContractData', 'contractInstances'])

    },

    data: function(){

        return{

        editableVersion: this.version
            
        }
    }
}
</script>

<style>

</style>