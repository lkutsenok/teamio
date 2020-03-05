import mongoose from 'mongoose';
import {CronJob} from 'cron'
import slackMonthTotalStatistic from "./jobs/slackMonthStatistics";
import {JiraImport} from "./import/jiraImport";

mongoose.connect(process.env.MONGODB_URL as string, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("🍀️Connected to MongoDB");
    // slackMonthTotalStatistic();
});

var job = new CronJob('35 13 1-31/2 * *', async () => {
  await JiraImport.execFullImport();
  slackMonthTotalStatistic();
});
job.start();