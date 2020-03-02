import moment from "moment";
import {MONTH_START_DAY} from "../config/config";

export function getStartOfCurrentMonth() {
    if (moment().diff(moment().startOf('month').add(MONTH_START_DAY - 1, "days")) >= 0) {
        return moment().startOf('month').add(MONTH_START_DAY - 1, "days");
    }
    return moment().subtract(1, 'month').startOf('month').add(MONTH_START_DAY - 1, "days");
}

export function getStartOfNextMonth() {
    return getStartOfCurrentMonth().add(1, 'month').startOf("month").add(MONTH_START_DAY - 1, 'days');
}