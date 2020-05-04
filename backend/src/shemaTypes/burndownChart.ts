import {schemaComposer} from "graphql-compose";
import {getStartOfCurrentMonth} from "../helpers/monthHelper";
import {burndownRealChart} from "../requests/burndownRealChart";
import {ResourcePlanModel} from "../models/ResourcePlan";

const BurndownChartTC = schemaComposer.createObjectTC({
    name: "BurndownChart",
    fields: {
        labels: ['String'],
        real: ['Float'],
        estimate: ['Float'],
    }
});

BurndownChartTC.addResolver({
    kind: 'query',
    name: 'get',
    args: {
        period: {
            type: "Date",
            defaultValue: getStartOfCurrentMonth().utc().toDate(),
        },
    },
    type: BurndownChartTC,
    resolve: async ({args}) => {
        const resplan = await ResourcePlanModel.findOne({period: args.period});
        const totalHours = resplan?.items?.reduce((a, b) => a + b?.hours!!, 0)
        const [{labels, real, estimate}] = await burndownRealChart(args.period, totalHours!!);
        real.unshift(totalHours);
        estimate.unshift(totalHours)
        let temp = 0
        return {
            labels: [" ", ...labels],
            estimate: estimate.map((val, i) => {
                temp = i == 0 ? val : (temp - val)
                return temp
            }),
            real: real.map((val, i) => {
                temp = i == 0 ? val : (temp - val)
                return temp
            }),
        }
    }
});

export {BurndownChartTC}
