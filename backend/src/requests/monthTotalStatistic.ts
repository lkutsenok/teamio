import moment from "moment";
import {IssueModel} from "../models/Issue";
import {getStartOfCurrentMonth} from "../helpers/monthHelper"
import {MONTH_START_DAY} from "../config";

export default function monthTotalStatistic(component: String | undefined): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        IssueModel.aggregate([
            {
                $unwind: {
                    path: "$subIssues",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    key: 1,
                    component: 1,
                    timeOriginalEstimate: {
                        $cond: {
                            if: {
                                $ifNull: ['$subIssues', false]
                            },
                            then: "$subIssues.timeOriginalEstimate",
                            else: "$timeOriginalEstimate"
                        }
                    },
                    assignee: {
                        $cond: {
                            if: {
                                $ifNull: ['$subIssues', false]
                            },
                            then: "$subIssues.assignee",
                            else: "$assignee"
                        }
                    },
                    resolutionDate: {
                        $cond: {
                            if: {
                                $ifNull: ['$subIssues', false]
                            },
                            then: "$subIssues.resolutionDate",
                            else: "$resolutionDate"
                        }
                    },

                }
            },
            {
                $project: {
                    _id: 1,
                    key: 1,
                    component: 1,
                    assignee: 1,
                    timeOriginalEstimate: {
                        $divide: ["$timeOriginalEstimate", 3600]
                    },
                    resolutionDate: 1
                }
            },
            {
                $match: {
                    resolutionDate: {
                        $gte: getStartOfCurrentMonth().toDate(),
                        $lt: getStartOfCurrentMonth().add(1, 'month').startOf("month").add(MONTH_START_DAY, 'days').toDate(),
                        $ne: null
                    },
                    assignee: {
                        $ne: null
                    },
                    ...(() => component ? {component: {$eq: component}} : {})()
                }
            },
            {
                $group: {
                    _id: 1,
                    total: {
                        $sum: "$timeOriginalEstimate"
                    }
                }
            }
        ]).exec().then(res => {
            resolve(res[0].total)
        }).catch(e => reject(e));
    });
}