import mongoose from 'mongoose';
import schedule from 'node-schedule'
import slackMonthTotalStatistic from "./jobs/slackMonthStatistics";
import {JiraImport} from "./import/jiraImport";

mongoose.connect(process.env.MONGODB_URL as string, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log("🍀️Connected to MongoDB");
    // await JiraImport.getProjects()
    // await JiraImport.getUsers()
    // await JiraImport.execFullImport()
});

schedule.scheduleJob('05 15 1-31/2 * *', async () => {
    await JiraImport.execFullImport();
    slackMonthTotalStatistic();
});

schedule.scheduleJob('*/30 * * * *', async () => {
  await JiraImport.execFullImport();
});
