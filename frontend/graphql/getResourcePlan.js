import gql from "graphql-tag";

export const GET_RESOURCE_PLAN = gql`
    query getResourcePlan {
        resourcePlan {
            _id
            version
            period
            items {
                _id
                assignee
                hours
                component {name}
                componentRef
                componentName @client
            }
            components @client
            assignees @client
        }
        components {
            _id
            name
        }
    }
`;
