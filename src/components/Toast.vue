<template>
    <section>

    </section>
</template>

<script>
import Toasted from 'vue-toasted';
import Vue from 'vue';

import hasura from '../hasura/hasuraHelper';

const UPDATE_STORE_PERFORMANCE_MUTATION = gql`mutation ($version: String!, $name: name!,$end_date: time!){
                update_store_performance  (
                    where: {_and: [
                        {version_detail: {version: {_eq: $version}}},
                         {version_detail: {app_detail:  {name: {_eq: $name}}}},
                         {end_date: {_is_null: true}}
                         ]},
                    
                    _set: {

                        end_date: $end_date
                    }
                )
                    {
                        affected_rows
                    }
                }`;


// let options = {
//     // pass the icon name as string
//     icon : 'check',
    
//     // or you can pass an object
//     icon : {
//         name : 'watch',
//         after : true // this will append the icon to the end of content
//     },

//     Duration: 3000
// };

Vue.use(Toasted);

import gql from 'graphql-tag';

export default {
/* eslint-disable */

    mounted() {

        const contractEventHandler = ({ contractName, eventName, data }) =>
        {   
            console.log(`eventName is ${eventName}`);

            let display;
            if(eventName === "newPackageEvent"){
                
                hasura.UpdateAllPerformance(this.$apollo, data.fileVersion, data.fileName, data.fileName, hasura.getDate(), 10);

                // hasura.updatePerformanceToHasura(this.$apollo, data.fileVersion, data.fileName, this.getDate(), 10);

            //    this.updatePerformanceToHasura(data.fileVersion, data.fileName, this.getDate());

                display = `Inside First Event: The following app ${data.fileName}  with main version ${data.fileVersion} has been deployed successfully`;

            }
            else if(eventName === "newPackageVersionEvent"){
                
                hasura.UpdateAllPerformance(this.$apollo, data.fileVersion, data.fileName, data.fileName, hasura.getDate(), 11);

                // hasura.updatePerformanceToHasura(this.$apollo, data.fileVersion, data.fileName, this.getDate(), 11);

                display = `A new version ${data.fileVersion} of the following app ${data.fileName}  has been deployed successfully`;
            }
            else if(eventName === "EditPackage"){
                
                if(data.fileName ==='' || !data.fileName || data.fileName == null){

                    hasura.UpdateAllPerformance(this.$apollo, 'edited', data.oldName, data.oldName, hasura.getDate(), 12);
                }
                else{

                    hasura.UpdateAllPerformance(this.$apollo, 'edited', data.oldName, data.fileName, hasura.getDate(), 12);

                }
                console.log(`Update to Hasura is name: ${data.oldName}`);

                // hasura.updatePerformanceToHasura(this.$apollo, data.fileVersion, data.fileName, this.getDate(), 12);

                display = `the following app ${data.fileName} details has been changed`;
            }
            else if(eventName === "deletePackage"){

                hasura.UpdateAllPerformance(this.$apollo, 'deleted all', data.fileName, data.fileName, hasura.getDate(), 13);
                // hasura.updateDeletePerformanceToHasura(this.$apollo, data.fileName + " delete all", data.fileName, this.getDate(), 13);

               display= `the following app ${data.fileName} has been deleted`;
            }
            else if(eventName === "deletePackageVersion"){

                hasura.UpdateAllPerformance(this.$apollo, data.fileVersion, data.fileName, data.fileName, hasura.getDate(), 14);
                // hasura.updatePerformanceToHasura(this.$apollo, data.fileVersion, data.fileName, this.getDate(), 14);

                display = `The  following version ${data.fileVersion} of the app ${data.fileName}  has been deleted`;
            }
            else{

                display = `The following unregistered event has been emitted ${eventName}`;
            }

            const subOptions =  { 	 theme: "toasted-primary", position: "bottom-right", duration : 5000};
            this.$toasted.clear();
            this.$toasted.info(display, subOptions);
        }
        this.$drizzleEvents.$on('drizzle/contractEvent', payload => {

            contractEventHandler(payload);
        });
    },

    methods: {
        
        updatePerformanceToHasura(version, appName, end_date){


          try {

                // alert(`Hasura data are version: ${version}, appName: ${appName}, and end_date: ${end_date}`);
                console.log(`Hasura data are version: ${version}, appName: ${appName}, and end_date: ${end_date}`);

                const result = this.$apollo.mutate({

                    mutation: UPDATE_STORE_PERFORMANCE_MUTATION,

                    variables: {
                        
                        version: version,
                        name: appName,
                        end_date: end_date
                    },

                    error(error){
                        
                        alert("api erro happened");
                        this.mutationError = error;
                        console.log(`Hasura error is ${JSON.stringify(error)}`);
                    }
                 });
          }
          catch(error){

            alert("connection error happened");

            console.log(`Adding to Hasura error is ${error}`);
          }
        },

         getDate(){

          const today = new Date();
          const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          const dateTime = date+' '+time;

          return dateTime;
        }
    },

    data: function(){

        return{

            mutationError:null,
        }
    }
}
</script>