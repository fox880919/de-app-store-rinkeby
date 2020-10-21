
<template>


  <div v-if="isDrizzleInitialized" id="app">


    <div class="section" >

      <nav  class="navbar navbar-expand-sm navbar-light navbar-jw" style="background-color: #e3f2fd;"> 

        <router-link to='/' class="col has-text-black-bis is-size-3"> Home</router-link>

          <router-link to='/account' class="col has-text-black-bis is-size-3"> Account Privileges </router-link>
          
          <router-link to='/apps' class="col has-text-black-bis is-size-3"> Apps </router-link>
          
          <router-link to='/add' class="col has-text-black-bis is-size-3"> Add New App </router-link>

      </nav>
      
      <router-view/>

      <vue-progress-bar></vue-progress-bar>


    </div>

    <Toast/>
    
  </div>
  <div v-else style="height:800px; width:800px; margin:auto;">
    <br/>
    <br/>
    <p>Loading application...has failed</p>

    <br/>
    <br/>
    <br/>
    <br/>
    
    <strong style="color: red;">Metamask couldnt be deteced</strong>
    <br/>
    <br/>

    <p>Please reconfigure your ethereum setup and try again by refreshing the page Or contact an admin for help</p>
  


  </div padding-bottom="20px">

  
</template>

<script>
import { mapGetters } from 'vuex'
import ipfs from './ipfs';
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

import Toast from './components/Toast';


export default {
  name: 'app',
   components: {
    vueDropzone: vue2Dropzone,
    Toast
  },
  computed: {
    ...mapGetters('drizzle', ['isDrizzleInitialized'])
  },
  
};

</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.home-load {
  width: 50px;
  height: 50px;
}
.card img {
  object-fit: cover;
  height: 500px;
  width: 500px;
}
.card {
  text-align: center;
  width: 500px;
  margin-bottom: 20px;
}
.home-list{
  padding: 0;
  list-style: none;
}
.home-card-text {
  text-align: justify;
  margin-top: 10px;
}
// #upload {
//   font-family: "Avenir", Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-bottom: 5%;
//   width: 500px;
// }


.upload-load {
  width: 50px;
  height: 100px;
}
.margin-xs {
  margin-top: 3%;
}
.margin-sm {
  margin-top: 7%;
}
.border-style {
  border: 1px solid #ced4da;
}

div {
  padding-bottom: 10px;
}
</style>
