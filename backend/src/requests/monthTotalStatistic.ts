import moment from "moment";
import {IssueModel} from "../models/Issue";
import {getStartOfCurrentMonth, getStartOfNextMonth} from "../helpers/monthHelper"
import {MONTH_START_DAY} from "../config";

export default function monthTotalStatistic(component: String | undefined): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        IssueModel.aggregate(
            [{
                $unwind: {
                    path: "$subIssues",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from: 'components',
                    localField: 'componentRef',
                    foreignField: '_id',
                    as: 'component'
                }
            }, {
                $project: {
                    key: 1,
                    component: {
                        $arrayElemAt: ["$component", 0]
                    },
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
                            then: "$subIssues.assigneeRef",
                            else: "$assigneeRef"
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
            }, {
                $project: {
                    _id: 1,
                    key: 1,
                    component: "$component.name",
                    assignee: 1,
                    timeOriginalEstimate: {
                        $divide: ["$timeOriginalEstimate", 3600]
                    },
                    resolutionDate: 1
                }
            }, {
                $match: {
                    resolutionDate: {
                        $gte: getStartOfCurrentMonth().toDate(),
                        $lt: getStartOfNextMonth().toDate(),
                        $ne: null
                    },
                    assignee: {
                        $ne: null
                    },
                    ...(() => component ? {component: {$eq: component}} : {})()
                }
            }, {
                $group: {
                    _id: 1,
                    total: {
                        $sum: "$timeOriginalEstimate"
                    }

                }
            }]).exec().then(res => {
            resolve(res[0] ? res[0].total : 0.0)
        }).catch(e => reject(e));
    });
}
