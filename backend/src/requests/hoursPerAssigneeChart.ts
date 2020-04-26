import {IssueModel} from "../models/Issue";

export async function hoursPerAssigneeChart(dateStart: Date, dateEnd: Date): Promise<any> {
    return new Promise((resolve, reject) => {
        IssueModel.aggregate([
            {
                $unwind: {
                    path: '$subIssues',
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
                            'if': {
                                $ifNull: [
                                    '$subIssues',
                                    false
                                ]
                            },
                            then: '$subIssues.timeOriginalEstimate',
                            'else': '$timeOriginalEstimate'
                        }
                    },
                    assigneeRef: {
                        $cond: {
                            'if': {
                                $ifNull: [
                                    '$subIssues',
                                    false
                                ]
                            },
                            then: '$subIssues.assigneeRef',
                            'else': '$assigneeRef'
                        }
                    },
                    resolutionDate: {
                        $cond: {
                            'if': {
                                $ifNull: [
                                    '$subIssues',
                                    false
                                ]
                            },
                            then: '$subIssues.resolutionDate',
                            'else': '$resolutionDate'
                        }
                    }
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'assigneeRef',
                    foreignField: '_id',
                    as: 'assignee'
                }
            }, {
                $project: {
                    _id: 1,
                    key: 1,
                    component: 1,
                    assignee: {
                        $arrayElemAt: ["$assignee", 0]
                    },
                    timeOriginalEstimate: {
                        $divide: [
                            '$timeOriginalEstimate',
                            3600
                        ]
                    },
                    resolutionDate: 1
                }
            }, {
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
            }, {
                $group: {
                    _id: {
                        component: '$component.name',
                        assignee: '$assignee.displayName'
                    },
                    total: {
                        $sum: '$timeOriginalEstimate'
                    }
                }
            }, {
                $project: {
                    component: {
                        $ifNull: ["$_id.component", "Unknown"]
                    },
                    assignee: "$_id.assignee",
                    total: 1,
                    _id: 0
                }
            }, {
                $match: {
                    total: {
                        $gt: 0
                    }
                }
            }, {
                $facet: {
                    data: [{
                        $group: {
                            _id: {
                                assignee: '$assignee'
                            },
                            hours: {
                                $push: {
                                    k: '$component',
                                    v: '$total'
                                }
                            }
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
                    ],
                    labels: [{
                        $group: {
                            _id: {
                                component: '$component'
                            }
                        }
                    },
                        {
                            $sort: {
                                '_id.component': 1
                            }
                        },
                        {
                            $group: {
                                _id: 0,
                                components: {
                                    $push: '$_id.component'
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                components: '$components'
                            }
                        }
                    ]
                }
            }, {
                $project: {
                    data: '$data',
                    labels: {
                        $arrayElemAt: [
                            '$labels.components',
                            0
                        ]
                    }
                }
            }
        ]).exec().then(data => resolve(data)).catch(e => reject(e));
    })
}
