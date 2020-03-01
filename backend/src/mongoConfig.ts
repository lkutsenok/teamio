import mongoose from 'mongoose';
import slackMonthTotalStatistic from "./jobs/slackMonthStatistics";

mongoose.connect(process.env.MONGODB_URL as string, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("🍀️Connected to MongoDB");
    // slackMonthTotalStatistic();
});