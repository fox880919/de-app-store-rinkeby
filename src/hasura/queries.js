import gql from 'graphql-tag'

const ALL_PERFORMANCE_QUERY = gql`query {
    
    all_performance_temp
    {   
        app_name
        consensus_type
        created_at
        end_date
        id
        operation_id
        performance_time
        start_date
        updated_at
        version    
    }

    }`;


const APP_INFO_QUERY = gql`query {
    
    app_details
    {
        name    
    }

    }`;

const APP_INFO_QUERY_WITH_NAME = gql`query ($name: name!){
    
    app_details( where: {name: {_eq: $name}} )
    {   
        id
        name    
    }

    }`;

const VERSION_INFO_QUERY_WITH_NAME_AND_VERSION = gql`query ($name: name!, $version: String!){
    
    version_details( where:{_and: [
        {version: {_eq: $version}},
        {app_detail:  {name: {_eq: $name}}}
    ]})
    {   
        id
    }
    }`;

//not complete
const VERSION_INFO_QUERY_WITH_NAME = gql`query ($name: name!){
    
    version_details( where:{_and: [
        {app_detail:  {name: {_eq: $name}}}
    ]})
    {   
        id
    }
    }`;



export default {

    app_info_query: APP_INFO_QUERY,
    app_info_query_with_name: APP_INFO_QUERY_WITH_NAME,
    version_info_query_with_Name_And_Version: VERSION_INFO_QUERY_WITH_NAME_AND_VERSION,
    version_info_query_with_Name: VERSION_INFO_QUERY_WITH_NAME,
    all_performance_query: ALL_PERFORMANCE_QUERY

}