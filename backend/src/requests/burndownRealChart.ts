import {IssueModel} from "../models/Issue";
import moment from "moment";
import {MONTH_START_DAY} from "../config";

export async function burndownRealChart(period: Date, totalHours: number): Promise<any> {
    const monthStart: Date = moment(period).utc().add(MONTH_START_DAY - 1, 'days').toDate();
    const monthEnd: Date = moment(period).utc().add(1, 'month').startOf('month').add(MONTH_START_DAY - 1, 'days').toDate();
    return new Promise((resolve, reject) => {
        IssueModel.aggregate(
            [{
                $unwind: {
                    path: '$subIssues',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    key: 1,
                    timeOriginalEstimate: {
                        $cond: {
                            'if': {
                                $ifNull: [
                                    '$subIssues',
                                    false
                                ]
                            },
                            then: '$subIssues.timeOriginalEstimate',
                            else: '$timeOriginalEstimate'
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
                            else: '$resolutionDate'
                        }
                    }
                }
            }, {
                $match: {
                    resolutionDate: {
                        $gte: monthStart,
                        $lt: monthEnd,
                        $ne: null
                    }
                }
            }, {
                $addFields: {
                    saleDate: {
                        $dateFromParts: {
                            year: {$year: "$resolutionDate"},
                            month: {$month: "$resolutionDate"},
                            day: {$dayOfMonth: "$resolutionDate"}
                        }
                    },
                    dateRange: {
                        $map: {
                            input: {$range: [0, {$divide: [{$subtract: [monthEnd, monthStart]}, 86400000]}, 1]},
                            in: {$add: [monthStart, {$multiply: ["$$this", 86400000]}]}
                        }
                    }
                }
            }, {$unwind: "$dateRange"}, {
                $group: {
                    _id: {
                        date: "$dateRange"
                    },
                    total: {
                        $sum: {
                            $cond: [{$eq: ["$dateRange", "$saleDate"]}, "$timeOriginalEstimate", 0]
                        }
                    }
                }
            }, {
                $group: {
                    _id: "$_id.date",
                    total: {$sum: "$total"}
                }
            }, {
                $sort: {
                    "_id": 1
                }
            }, {
                $facet: {
                    real: [
                        ...(() => moment().utc().startOf('day') < moment(monthEnd).utc() ? [{
                            $match: {
                                _id: {
                                    $lte: moment().utc().startOf('day').toDate(),
                                }
                            }
                        },] : [])(),
                        {
                            $group: {
                                _id: 0,
                                total: {$push: {$divide: ["$total", 3600]}}
                            }
                        }
                    ],
                    estimate: [
                        {
                            $group: {
                                _id: 0,
                                total: {
                                    $push: {
                                        $divide: [totalHours, {$divide: [{$subtract: [monthEnd, monthStart]}, 86400000]}]
                                    }
                                }
                            }
                        }
                    ],
                    labels: [
                        {
                            $group: {
                                _id: 0,
                                total: {$push: {$dayOfMonth: "$_id"}}
                            }
                        }
                    ]
                }
            }, {
                $project: {
                    real: {$arrayElemAt: ["$real", 0]},
                    estimate: {$arrayElemAt: ["$estimate", 0]},
                    labels: {$arrayElemAt: ["$labels", 0]},
                }
            }, {
                $project: {
                    real: "$real.total",
                    estimate: "$estimate.total",
                    labels: "$labels.total"
                }
            }
            ]).exec().then(data => resolve(data)).catch(e => reject(e));
    })
}
