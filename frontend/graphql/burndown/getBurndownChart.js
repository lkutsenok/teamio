import gql from "graphql-tag";

export const GET_BURNDOWN_CHART = gql`
    query getBurndownChart($period: Date!) {
        burndownChart(period: $period){
            labels
            real
            estimate
        }
    }
`;
