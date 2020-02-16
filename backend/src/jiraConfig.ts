import JiraClient from 'jira-connector';
import {JIRA_URL, JIRA_LOGIN, JIRA_PASSWORD} from "./config";

export const jira = new JiraClient({
    host: JIRA_URL,
    strictSSL: true,
    basic_auth: {
        username: JIRA_LOGIN,
        password: JIRA_PASSWORD,
    }
});