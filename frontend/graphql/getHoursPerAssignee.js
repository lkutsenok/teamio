import gql from "graphql-tag";

export const GET_HOURS_PER_ASSIGNEE = gql`
    query getHoursPerAssigne($dateStart: Date, $dateEnd: Date) {
        hoursPerAssignee(dateStart: $dateStart, dateEnd: $dateEnd) {
            assignee
            component
            hours
        },
        hoursPerAssigneeChart(dateStart: $dateStart, dateEnd: $dateEnd) {
            labels,
            hours {
                label,
                data
            }
        }
    }
`;