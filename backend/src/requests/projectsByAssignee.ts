import {IssueModel} from "../models/Issue";

export async function projectsByAssigneeTable() {
    return await IssueModel.aggregate([
        {
            $unwind: {
                path: '$subIssues',
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
                        then: '$subIssues.timeOriginalEstimate',
                        else: '$timeOriginalEstimate'
                    }
                },
                assignee: {
                    $cond: {
                        if: {
                            $ifNull: ['$subIssues', false]
                        },
                        then: '$subIssues.assignee',
                        else: '$assignee'
                    }
                },
                resolutionDate: {
                    $cond: {
                        if: {
                            $ifNull: ['$subIssues', false]
                        },
                        then: '$subIssues.resolutionDate',
                        else: '$resolutionDate'
                    }
                },

            }
        },
        {
            $match: {
                resolutionDate: {
                    $gte: new Date("2019-10-01"),
                    $lt: new Date("2019-11-01"),
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
                    component: '$component',
                    assignee: '$assignee',

                },
                total: {
                    $sum: '$timeOriginalEstimate'
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
            $group: {
                _id: {
                    assignee: '$_id.assignee',

                },
                hours: {
                    $push: {
                        k: '$_id.component',
                        v: '$total'
                    }
                },

            }
        },
        {
            $addFields: {
                hours: {
                    $arrayToObject: '$hours'
                }
            }
        },
        {
            $project: {
                assignee: '$_id.assignee',
                hours: 1,
                _id: 0
            }
        }
    ])
}