import mongoose from 'mongoose';
import {CronJob} from 'cron'
import slackMonthTotalStatistic from "./jobs/slackMonthStatistics";
import {JiraImport} from "./import/jiraImport";

mongoose.connect(process.env.MONGODB_URL as string, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log("🍀️Connected to MongoDB");
    // slackMonthTotalStatistic();
    await JiraImport.execFullImport();
    slackMonthTotalStatistic();
});

// var job = new CronJob('00 15 1-31/2 * *', async () => {
var job = new CronJob('* * * * *', async () => {
    await JiraImport.execFullImport();
    slackMonthTotalStatistic();
});
// var job2 = new CronJob('*/30 * * * *', async () => {
//   await JiraImport.execFullImport();
// });
job.start();
// job2.start();
