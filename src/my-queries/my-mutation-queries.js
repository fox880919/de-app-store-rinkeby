import gql from 'graphql-tag'

const INSERT_APP_DETAILS_MUTATION = gql`mutation ($name: name!, $image: String!){
    insert_app_details(
        objects:[
        {
            name: $name,
            image: $image,
         }
        ])
        {
            affected_rows
            returning {
            name
            image
         }
        }
    }`;

module.exports = {

InsertAppDetailsMutation :INSERT_APP_DETAILS_MUTATION
}