import {ResourcePlanModel} from "../models/ResourcePlan";
import moment from "moment";

export async function burndownEstimateChart(period: Date): Promise<any> {
    const _period: Date = moment(period).utc().toDate()
    const monthStart: Date = moment(period).utc().toDate();
    const monthEnd: Date = moment(period).utc().add(1, 'month').startOf('month').toDate();
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
