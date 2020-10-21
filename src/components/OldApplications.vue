<template>
 
  <div class="section" v-if="appsCount" id="Applications"  > 

    <div>
      <p > <strong>Store Apps</strong>: {{ appsCount }}  </p>

    </div>

   <div v-if="appsCount>0" class="field">
            

            <b-switch v-model="onlyMyApps">
              Only my Apps (to edit) <Strong style="color: green;">Mode</Strong>
            </b-switch>

            <pre style="color: blue;"><strong style="color: red;">Note:</strong> <br> Only admins can edit all apps and will be shown all apps in this mode</pre>

    </div>

    <div class="">
      <div  v-for="(app, i) in packages" :key="i">
      
      <app-component v-if="appIsLoaded(app)" :app="app" :packageIndex="i" :onlyMyApps="onlyMyApps" margin-top="100px" class="column is-10-widescreen"></app-component>
      
      </div>
      <!-- <div  v-for="(app, index) in packages" :key="index">

        <applications-components :index="app"></applications-components>

      </div> -->

    </div>

</div> 
</template>

<script>

import AppComponent from './AppComponent';
import ApplicationsComponents from './ApplicationsComponents';


import { mapGetters } from 'vuex';
import ipfs from '../ipfs';



const countArgs = {
    contractName: 'PackageStore',
    method: 'getPackagescount',
    methodArgs: ''
}

const packagesArgs = {
    contractName: 'PackageStore',
    method: 'getPackageInfo',
    methodArgs:'0'
}

// const versionHashArgs = {
//     contractName: 'PackageStore',
//     method: 'getPackageVersionHash',
//     methodArgs:[]
// }

export default {
  name: 'Applications',
  components: {
    AppComponent,
    ApplicationsComponents
  },
  methods: {

    appIsLoaded(app){

        if(!app.name)
        {
          
          //console.log ("return false for null");

          return false
        }
        else if (app.name === 'l' || app.name.length < 2)
        {
          //console.log ("return false generally");

          return false;
        }
        
        //console.log ("return true");
        return true
      }
  },
  computed: {

    ...mapGetters('drizzle', ['drizzleInstance']),

    ...mapGetters('contracts' , ['getContractData', 'contractInstances']),

      appsCount(){
      
      let count = this.getContractData({ contract: countArgs.contractName, method: countArgs.method });
      if (count === "loading") return false;
      //console.log(`App count is ${count}`);
      
      return count;
    },
    packages(){

      const count = this.appsCount;

      // console.log(`appsCount is: ${this.appsCount}`);

      let apps = [];
      
      for(let i = 0; i < count; i++)
      { 
        //let test1 = this.drizzleInstance.contracts['PackageStore'].methods['getPackageName'].cacheCall(i);

        packagesArgs.methodArgs = (""+ i);


        //console.log(`calling contract ${packagesArgs.contractName} Method ${packagesArgs.method} Args ${packagesArgs.methodArgs }`);        

        this.$store.dispatch('drizzle/REGISTER_CONTRACT',packagesArgs);

        // this.$store.dispatch('drizzle/REGISTER_CONTRACT',packagesArgs);


        let app = this.getContractData({ contract: packagesArgs.contractName, method: packagesArgs.method, methodArgs: packagesArgs.methodArgs });


        //console.log(`The value returned is ${app[0]} & imgHash: ${app[1]} & ${app[2]} & ${app[3]}`);
        
        // versionHashArgs.methodArgs = [app[0], app[3]+''];



        // this.$store.dispatch('drizzle/REGISTER_CONTRACT',versionHashArgs);

        apps.push({name: app[0], img: `https://ipfs.io/ipfs/${app[1]}`, versions: app[2], lastVersion: app[3], canEdit: app[4], appOwner: app[5]});

       // console.log(`finished loop number ${i}`);
      }

      let appsCountArray = [];

      for (let i = 0; i < count; i++)
      {
        
        appsCountArray.push(i);
      }


        this.finishedLoading = true;
        return apps;
    }
  },
      created(){

        this.$store.dispatch('drizzle/REGISTER_CONTRACT', countArgs);

          },
      data: () => ({

        onlyMyApps: false,
    })
}
</script>
