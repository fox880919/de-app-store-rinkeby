/* eslint-disable */

<template>

  <div id="account" style="padding: 40px;">

    <div>  Your account address is: <p style="color: blue;">{{ activeAccount }} </p></div>
    <br>
    <br>
    <div>Your Balance is: <p style="color: blue;"> {{ activeBalance }} </p> <strong style="color:green;">Wei</strong></div>
    <br>
    <br>
    <br>
    <br>
    <p style="color:red;"> User Type:</p>
    <br>

    <user-type-profile></user-type-profile>

</div>

</template>

<script>
/* eslint-disable */

import { mapGetters } from 'vuex';

import UserTypeProfile from './UserTypeProfile';


export default {

    name: 'account',

    components: {

        UserTypeProfile
    },

    computed: {

    ...mapGetters('accounts', ['activeAccount', 'activeBalance'])
    }
}
</script>