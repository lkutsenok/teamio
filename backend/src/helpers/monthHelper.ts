import moment from "moment";
import {MONTH_START_DAY} from "../config";

export function getStartOfCurrentMonth() {
    if(moment().diff(moment().startOf('month').add(MONTH_START_DAY, "days")) >= 0) {
        return moment().startOf('month').add(MONTH_START_DAY, "days");
    }
    return moment().subtract(1, 'month').startOf('month').add(MONTH_START_DAY, "days");
}
