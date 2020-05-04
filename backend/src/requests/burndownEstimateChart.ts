import {ResourcePlanModel} from "../models/ResourcePlan";
import moment from "moment";
import {MONTH_START_DAY} from "../config";

export async function burndownEstimateChart(period: Date): Promise<any> {
    const _period: Date = moment(period).utc().toDate()
    const monthStart: Date = moment(period).utc().add(MONTH_START_DAY - 1, 'days').toDate();
    const monthEnd: Date = moment(period).utc().add(1, 'month').startOf('month').add(MONTH_START_DAY - 1, 'days').toDate();
    return new Promise((resolve, reject) => {
        ResourcePlanModel.aggregate(
            [{
                $match: {
                    period: {
                        $eq: _period,
                    }
                }
            }, {
                $project: {
                    total: {
                        $sum: "$items.hours"
                    }
                }
            }, {
                $addFields: {
                    dateRange: {
                        $map: {
                            input: {$range: [0, {$divide: [{$subtract: [monthEnd, monthStart]}, 86400000]}, 1]},
                            in: {
                                date: {$add: [monthStart, {$multiply: ["$$this", 86400000]}]},
                                total: {$divide: ["$total", {$divide: [{$subtract: [monthEnd, monthStart]}, 86400000]}]},
                            }
                        }
                    }
                }
            }]).exec().then(data => resolve(data)).catch(e => reject(e));
    })
}
