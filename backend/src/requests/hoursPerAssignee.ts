import {IssueModel} from "../models/Issue";

export async function hoursPerAssignee(dateStart: Date, dateEnd: Date): Promise<any> {
    return new Promise((resolve, reject) => {
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
                    timeOriginalEstimate: {$divide: ["$timeOriginalEstimate", 3600]},
                    resolutionDate: 1
                }
            },
            {
                $match: {
                    resolutionDate: {
                        $gte: dateStart,
                        $lt: dateEnd,
                        $ne: null
                    },
                    assignee: {
                        $ne: null
                    }
                }
            },
            {
                $group: {
                    _id: {
                        component: "$component",
                        assignee: "$assignee",

                    },
                    total: {
                        '$sum': "$timeOriginalEstimate"
                    }
                }
            },
            {
                $match: {
                    total: {
                        $gt: 0
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    component: '$_id.component',
                    assignee: '$_id.assignee',
                    hours: '$total'
                }
            }
        ]).exec().then(data => resolve(data)).catch(e => reject(e));
    })
}