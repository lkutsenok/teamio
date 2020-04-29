import gql from "graphql-tag";

export const GET_RESOURCE_PLAN = gql`
    query getResourcePlan($period: Date) {
        resourcePlan(filter: {period: $period}) {
            _id
            version
            period
            items {
                _id
                assignee {displayName, role}
                assigneeRef
                assigneeName @client
                assigneeRole @client
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
        users(filter: {isActive: true}) {
            _id
            displayName
            role
        }
    }
`;
