import gql from 'graphql-tag'


const INSERT_ALL_PERFORMANCE_MUTATION = gql`mutation ($version: String!, $name: name!, $start_date: time!, $operationId: Int!){
    insert_all_performance_temp  (
        objects:[
        {

            app_name: $name
            consensus_type: 2
            operation_id: $operationId
            start_date: $start_date
            version: $version
         }
        ])
        {
            affected_rows
            returning{
                
                app_name
                consensus_type
                operation_id
                start_date
                version
            }
        }
    }`;

const UPDATE_ALL_PERFORMANCE_MUTATION = gql`mutation ($version: String!, $name: name!,$end_date: time!, $operationId: Int!, $newName: name!){
    update_all_performance_temp  (
        where: {_and: [
             {app_name: {_eq: $name}},
             {end_date: {_is_null: true}},
             {operation_id: {_eq: $operationId}}
             ]},
        
        _set: {
            app_name: $newName,
            end_date: $end_date
        }
    )
        {
            affected_rows
        }
    }`;

const INSERT_APP_STORE_PERFORMANCE_MUTATION = gql`mutation ($version: String!, $name: name!, $image: String!, $start_date: time!, $operationId: Int!){
    insert_store_performance  (
        objects:[
        {
            start_date: $start_date,
            consensus_type_id: 2
            operation_id: $operationId

            version_detail: {
              data:{

                version: $version
                
                app_detail: {
                  
                  data:{

                    name: $name,
                    image: $image,
                    consensus_type_id: 2

                  }
                }
              }
            }

         }
        ])
        {
            affected_rows
        }
    }`;

const INSERT_WITH_APP_ID_STORE_PERFORMANCE_MUTATION = gql`mutation ($version: String!, $start_date: time!, $operationId: Int!, $appId: Int!){
    insert_store_performance   (
        objects:[
        {
            start_date: $start_date,
            consensus_type_id: 2
            operation_id: $operationId

            version_detail: {
              data:{

                version: $version
                
                app_id: $appId

              }
            }
         }
        ])
        {
            affected_rows
        }
    }`;

const INSERT_WITH_VERSION_ID_STORE_PERFORMANCE_MUTATION = gql`mutation ($version: String!, $name: name!, $start_date: time!, $operationId: Int!, $versionId: Int!){
    insert_store_performance   (
        objects:[
        {
            start_date: $start_date,
            consensus_type_id: 2
            operation_id: $operationId

            app_version_id: {
              data:{

                version: $version
                
                app_id: $appId
              }
            }

         }
        ])
        {
            affected_rows
        }
    }`;

const UPDATE_STORE_PERFORMANCE_MUTATION = gql`mutation ($version: String!, $name: name!,$end_date: time!, $operationdId: Int!){
    update_store_performance  (
        where: {_and: [
            {version_detail: {version: {_eq: $version}}},
             {version_detail: {app_detail:  {name: {_eq: $name}}}},
             {end_date: {_is_null: true}},
             {operation_id: {_eq: $operationdId}}
             ]},
        
        _set: {

            end_date: $end_date
        }
    )
        {
            affected_rows
        }
    }`;

const UPDATE_DELETE_ALL_PERFORMANCE_MUTATION = gql`mutation ($name: name!,$end_date: time!, $operationdId: Int!){
    update_store_performance  (
        where: {_and: [
            {version_detail: {version: {_eq: ""}}},
             {version_detail: {app_detail:  {name: {_eq: $name}}}},
             {end_date: {_is_null: true}},
             {operation_id: {_eq: $operationdId}}
             ]},
        
        _set: {

            end_date: $end_date
        }
    )
        {
            affected_rows
        }
    }`;


export default {

    insert_performance: INSERT_ALL_PERFORMANCE_MUTATION,

    update_performance: UPDATE_ALL_PERFORMANCE_MUTATION,

    insert_app_store_performance_mutation: INSERT_APP_STORE_PERFORMANCE_MUTATION,

    insert_with_app_id_store_performance_mutation: INSERT_WITH_APP_ID_STORE_PERFORMANCE_MUTATION,

    insert_with_version_id_store_performance_mutation : INSERT_WITH_VERSION_ID_STORE_PERFORMANCE_MUTATION,

    update_store_performance_mutation: UPDATE_STORE_PERFORMANCE_MUTATION,

    update_delete_store_performance_mutation: UPDATE_DELETE_ALL_PERFORMANCE_MUTATION
}