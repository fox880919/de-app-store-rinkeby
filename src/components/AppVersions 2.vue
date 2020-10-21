<template>
  <div>

    <div  v-for="(version, i) in versionsArray" :key="i">

      <!-- <version-edit :app= "app" :versions="versions" :version="version"></version-edit> -->
      <download-and-delete-version :app= "app" :version="version" :versions="versions" :index="i"></download-and-delete-version>

    </div>
  </div>
</template>

<script>
/* eslint-disable */

import VersionEdit from './VersionEdit';
import DownloadAndDeleteVersion from './DownloadAndDeleteVersion';

export default {


    props: {
        app: {
            type: Object,
            default: () => ({})
        },
    },
    
    components: {

      VersionEdit,
  
      DownloadAndDeleteVersion
    },



    data: function(){

        return {

          versionsArray: []
        }
    },

    computed: {

      versions(){

        this.versionsArray = this.app.versions.split(",");

        for(let i = 0; i < this.versionsArray.length; i++){

          this.versionsArray[i] = this.versionsArray[i].substring(3);
        }

      // console.log(`app.versions is ${this.app.versions}`);
      return this.versionsArray;
      }
    },

    mounted(){

         this.versionsArray = this.app.versions.split(",");

          //console.log(`all app versions are ${this.app.versions}`);


        for(let i = 0; i < this.versionsArray.length; i++){
          
          this.versionsArray[i] = this.versionsArray[i].substring(3);

           //console.log(`app version number ${i} is ${this.versionsArray[i]}`);
      }
    }
}
</script>

<style>

</style>