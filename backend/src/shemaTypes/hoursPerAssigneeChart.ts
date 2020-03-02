import {schemaComposer} from "graphql-compose";
import {getStartOfCurrentMonth, getStartOfNextMonth} from "../helpers/monthHelper";
import {MONTH_START_DAY} from "../config";
import {hoursPerAssigneeChart} from "../requests/hoursPerAssigneeChart";
import {Map} from "typescript";

const HoursPerAssigneeChartTC = schemaComposer.createObjectTC({
    name: "HoursPerAssigneeChart",
    fields: {
        labels: ['String'],
        hours: [`type HoursPerAssigneeChartHours {
            label: String,
            data: [Float]
        }`]
    }
});

HoursPerAssigneeChartTC.addResolver({
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
    type: HoursPerAssigneeChartTC,
    resolve: async ({args, context}) => {
        let res = await hoursPerAssigneeChart(args.dateStart, args.dateEnd);
        const {labels,data} = res[0];
        return {
            labels,
            hours: data.map(item => ({
                label: item.assignee,
                data: new Array<number>(labels.length).fill(0).map((d,i) => item.hours[labels[i]] || 0)
            }))
        }
    }
});

export {HoursPerAssigneeChartTC}