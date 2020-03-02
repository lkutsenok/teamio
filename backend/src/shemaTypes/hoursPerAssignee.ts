import {schemaComposer} from "graphql-compose";
import {getStartOfCurrentMonth, getStartOfNextMonth} from "../helpers/monthHelper";
import {MONTH_START_DAY} from "../config";
import {hoursPerAssignee} from "../requests/hoursPerAssignee";

const HoursPerAssigneeTC = schemaComposer.createObjectTC({
    name: "HoursPerAssignee",
    fields: {
        component: 'String',
        assignee: 'String',
        hours: 'Float',
    }
});

HoursPerAssigneeTC.addResolver({
    kind: 'query',
    name: 'get',
    args: {
        dateStart: {
            type: "Date",
            defaultValue: getStartOfCurrentMonth().toDate(),
        },
        dateEnd: {
            type: "Date",
            defaultValue: getStartOfNextMonth().toDate(),
        }
    },
    type: [HoursPerAssigneeTC],
    resolve: async ({args, context}) => {
        console.log(args.dateStart, args.dateEnd);
        return await hoursPerAssignee(args.dateStart, args.dateEnd)
    }
});

export {HoursPerAssigneeTC}