import gql from "graphql-tag";

export const UPDATE_RESOURCE_PLAN = gql`
    mutation updateResourcePlan($_id: MongoID!, $items: [ResourcePlanItemsInput]!) {
        updateResourcePlan(record: {_id: $_id, items: $items}) {
            recordId
        }
    }
`;
