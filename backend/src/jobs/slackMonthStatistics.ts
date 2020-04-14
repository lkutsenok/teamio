import axios from 'axios'
import monthTotalStatistic from "../requests/monthTotalStatistic";
import {SLACK_WEBHOOK_URL} from "../config";
import moment from "moment";
import {getStartOfCurrentMonth} from "../helpers/monthHelper";
import {JiraImport} from "../import/jiraImport";


export default function slackMonthTotalStatistic(): void {
    Promise.all([monthTotalStatistic(undefined), monthTotalStatistic('RobotBull'), monthTotalStatistic('RobotBull.Capital')]).then(hours => {
        console.log(hours[0], hours[1]);
        const diffMonthStart = moment().diff(getStartOfCurrentMonth(), 'days');
        axios.post(SLACK_WEBHOOK_URL, JSON.stringify({
            username: "Спокойствие Никиты",
            text: `Статистика на ${moment().format("DD.MM.YYYY HH:mm")}\n` +
                `Часов всего: ${Math.floor(hours[0] * 100) / 100} ч. (${Math.floor(hours[0] / moment().diff(getStartOfCurrentMonth(), 'days') * 100) / 100} ч/день)\n` +
                `Часов RobotBull: ${Math.floor(hours[1] * 100) / 100} ч. (${Math.floor(hours[1] / hours[0] * 100)}%)\n` +
                `Часов RobotBull.Capital: ${Math.floor(hours[2] * 100) / 100} ч. (${Math.floor(hours[2] / hours[0] * 100)}%)` +
                (diffMonthStart >= 10 ? "\nЧасов ожидается: " + Math.floor(hours[0] / diffMonthStart * getStartOfCurrentMonth().daysInMonth()) + " ч." : ""),
            channel: "#staff-works"
        }));
        console.log(`Статистика на ${moment().format("DD.MM.YYYY HH:mm")}\n` +
            `Часов всего: ${hours[0]} ч.\n` +
            `Часов RobotBull: ${hours[1]} ч.` +
            (diffMonthStart >= 10 ? "\nЧасов ожидается: " + Math.floor(hours[0] / diffMonthStart * getStartOfCurrentMonth().daysInMonth()) + " ч." : ""));
    })
}