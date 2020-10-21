
import myMutations from './mutations'
import myQueries from './queries'


export default {

    async addAllPerformance(apollo, version, appName, start_date, operation_id){

        try {

            let result = await apollo.mutate({

                mutation: myMutations.insert_performance,

                variables: {
                    
                    version: version,
                    name: appName,
                    start_date: start_date,
                    operationId: operation_id
                },

                error(error){

                    console.log(`Hasura error is ${JSON.stringify(error)}`);
                }
            });

           // return result;
           console.log(`Hasura adding data are version: ${version}, appName: ${appName}, start_date: ${start_date}, and operation_ID: ${operation_id}`);

           console.log(`hasura results are ${JSON.stringify(result)} `);
        }
        catch(error){

        console.log(`Adding to Hasura error is ${error}`);
        }
    },

    async UpdateAllPerformance(apollo, version, oldAppName, newAppName, end_date, operation_id){

        try {
              // alert(`Hasura data are version: ${version}, appName: ${appName}, and end_date: ${end_date}`);
              console.log(`Hasura updating data are version: ${version}, oldAppName: ${oldAppName}, newAppName: ${newAppName}, end_date: ${end_date} && operation id is ${operation_id}`);

              const result = await apollo.mutate({

                  mutation: myMutations.update_performance,

                  variables: {
                      
                      version: version,
                      name: oldAppName,
                      end_date: end_date,
                      operationId: operation_id,
                      newName: newAppName
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



    async addPerformanceToHasura(apollo, version, appName, image, start_date, operation_id){

        try {
            console.log(`Hasura adding data are version: ${version}, appName: ${appName}, image: ${image}, start_date: ${start_date}, and operation_ID: ${operation_id}`);

            await apollo.mutate({

                mutation: myMutations.insert_app_store_performance_mutation,

                variables: {
                    
                    version: version,
                    name: appName,
                    image: image,
                    start_date: start_date,
                    operationId: operation_id
                },

                error(error){

                    console.log(`Hasura error is ${JSON.stringify(error)}`);
                }
            });

           // return result;
        }
        catch(error){

        console.log(`Adding to Hasura error is ${error}`);
        }
    },

    async addWithExistingAppPerformanceToHasura(apollo, version, appName, start_date, operation_id){


        try {
            console.log(`Hasura adding with id data are version: ${version}, appName: ${appName}, and start_date: ${start_date}`);

            let queryResult = await apollo.query({

                query: myQueries.version_info_query_with_Name_And_Version,
  
                variables: {
  
                    name: appName,

                    version: version
                },
                
                error(error){
  
                  console.log(`Hasura error is ${JSON.stringify(error)}`);
              }
              });

              
              console.log(`the app details are ${JSON.stringify(queryResult.data.version_details)}`);


            if( queryResult.data.version_details.length == 0)
            {
                
                this.addPerformanceToHasura(apollo, version, appName, '', start_date, operation_id)
            }
            else{

                let version_id = queryResult.data.version_details[0].id;

                console.log(`the app details are ${JSON.stringify(queryResult.data.version_details)}`);
                console.log(`the app ID is ${JSON.stringify(version_id)}`);
            
                const result = apollo.mutate({

                    mutation: myMutations.insert_with_version_id_store_performance_mutation,
    
                    variables: {
                        
                        version: version,
                        name: appName,
                        start_date: start_date,
                        operationId: operation_id,
                        versionId: version_id
                    },
    
                    error(error){
    
                        console.log(`Hasura error is ${JSON.stringify(error)}`);
                    }
                });
            }
            
           // return result;
        }
        catch(error){

        console.log(`Adding to Hasura error is ${error}`);
        }
    },
    

    async addNewVersionPerformanceToHasura(apollo, version, appName, start_date, operation_id){


        try {
            console.log(`Hasura adding with id data are version: ${version}, appName: ${appName}, and start_date: ${start_date}`);

            let queryResult = await apollo.query({

                query: myQueries.app_info_query_with_name,
  
                variables: {
  
                    name: appName,
                },
                
                error(error){
  
                  console.log(`Hasura error is ${JSON.stringify(error)}`);
              }
              });
           
              console.log(`the app details are ${JSON.stringify(queryResult.data.version_details)}`);

            if( queryResult.data.app_details.length == 0)
            {
                
                this.addPerformanceToHasura(apollo, version, appName, '', start_date, operation_id)
            }
            else{

                let app_id = queryResult.data.version_details[0].id;

                console.log(`the app details are ${JSON.stringify(queryResult.data.version_details)}`);
                console.log(`the app ID is ${JSON.stringify(app_id)}`);
            
                const result = apollo.mutate({

                    mutation: myMutations.insert_with_app_id_store_performance_mutation,
    
                    variables: {
                        
                        version: version,
                        start_date: start_date,
                        operationId: operation_id,
                        appId: app_id
                    },
    
                    error(error){
    
                        console.log(`Hasura error is ${JSON.stringify(error)}`);
                    }
                });
            }
            
           // return result;
        }
        catch(error){

        console.log(`Adding to Hasura error is ${error}`);
        }
    },


   async updatePerformanceToHasura(apollo, version, appName, end_date, operation_id){


        try {
              // alert(`Hasura data are version: ${version}, appName: ${appName}, and end_date: ${end_date}`);
              console.log(`Hasura updating data are version: ${version}, appName: ${appName}, and end_date: ${end_date}`);

              const result = await apollo.mutate({

                  mutation: myMutations.update_store_performance_mutation,

                  variables: {
                      
                      version: version,
                      name: appName,
                      end_date: end_date,
                      operationId: operation_id
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

      


      async updateDeletePerformanceToHasura(apollo, appName, end_date, operation_id){


        try {
              // alert(`Hasura data are version: ${version}, appName: ${appName}, and end_date: ${end_date}`);
              console.log(`Hasura updating data are version: ${version}, appName: ${appName}, and end_date: ${end_date}`);

              const result = await apollo.mutate({

                  mutation: myMutations.update_store_performance_mutation,

                  variables: {
                      
                      version: version,
                      name: appName,
                      end_date: end_date,
                      operationId: operation_id
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
}
