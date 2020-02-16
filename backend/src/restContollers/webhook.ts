import express from 'express';
import {JiraImport} from "../import/jiraImport";

let router = express.Router();

router.get('/jira-import', async (req, res) => {
    let data = await JiraImport.execFullImport();
    res.send(data);
});


export default router;