<template>

    <div>

        <title> Store Role</title>

        <div v-if="userType == 0">
            
            <h1 class= "is-size-1">Main Owner</h1>

            <user-admin></user-admin>
        </div>

        <div v-if="userType == 1">
            Store admin
        </div>

        <div v-if="userType == 2">
            Regular User
        </div>

    </div>

</template>

<script>
/* eslint-disable */

import { mapGetters } from 'vuex';

import UserAdmin from './UserAdmin';


const UserTypeArgs = {
    contractName: 'PackageStore',
    method: 'isAnOwnerOrAdminOrUser',
    methodArgs:''
}

export default {

    components: {

       UserAdmin
    },

    computed: {

        ...mapGetters('drizzle', ['drizzleInstance']),

        ...mapGetters('contracts' , ['getContractData', 'contractInstances']),


        userType(){
        
        let type = this.getContractData({ contract: UserTypeArgs.contractName, method: UserTypeArgs.method });
        
        if (type === "loading" || !type) return false;
        //console.log(`App count is ${count}`);
        return type;
        },
    },

    mounted(){

        this.$store.dispatch('drizzle/REGISTER_CONTRACT', UserTypeArgs);
    }
}

</script>

<style>

</style>