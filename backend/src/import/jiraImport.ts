import _ from 'lodash';
import {ImportInterface} from "./import";
import {_Issue, Issue, IssueModel, SubIssue} from "../models/Issue";
import {jira} from "../jiraConfig";

const MAX_RESULTS = 1000;

export class JiraImport implements ImportInterface {
    static async execFullImport() {
        let total = undefined;
        let issues: { [key: string]: Issue } = {};
        let subIssues: SubIssue[] = [];

        for (let at = 0; !total || at <= total; at += MAX_RESULTS) {
            const data = await jira.search.search({
                jql: "ORDER BY due ASC",
                fields: [
                    "timespent",
                    "timeoriginalestimate",
                    "description",
                    "project",
                    "components",
                    "resolutiondate",
                    "created",
                    "customfield_10101",
                    "component",
                    "duedate",
                    "assignee",
                    "updated",
                    "component",
                    "status",
                    "parent"
                ],
                startAt: at,
                maxResults: MAX_RESULTS,
            });
            if (!total) total = data.total; //обеспечиваем работу пагинации
            //на основе данных из Jira создаем массив Issues и SubIssues
            const _issues = data.issues.map(({key, id, fields}) => ({
                id: id,
                key: key,
                description: fields.description,
                project: fields.project.name,
                assignee: fields.assignee && fields.assignee.name,
                status: fields.status && fields.status.name,
                created: fields.created,
                updated: fields.updated,
                dueDate: fields.duedate,
                component: fields.components.length && fields.components[0].name,
                resolutionDate: fields.resolutiondate,
                epic: fields.customfield_10101,
               // epicId: fields
                timeOriginalEstimate: fields.timeoriginalestimate || 0,
                timeSpent: fields.timespent || fields.resolutiondate && fields.timeoriginalestimate || 0,
                parent: fields.parent && fields.parent.key,
                subIssues: [],
            }));

            //и разделяем их по полю parent: если parent есть, то это SubIssue
            const [resSubIssues, resIssues] = _.partition(_issues, (issue) => issue.parent);

            //обрабатываем Issues
            issues = {
                ...issues,
                ...Object.assign({}, ...resIssues.map(issue => ({[issue.key]: issue})))
            };

            //обрабатываем SubIssues
            subIssues.push(...resSubIssues);

        }
        subIssues.forEach((subIssue: SubIssue) => issues[subIssue.parent!].subIssues!.push(subIssue));
        Object.values(issues).forEach((issue: Issue) => {
            //TODO: это должно быть динамично через связи
            switch (issue.project!) {
                case("MedRavel") :
                    issue.component = "MedRavel";
                    break;
                case("PlanSharing") :
                    issue.component = "PlanSharing";
                    break;
                case("PaxPeer") :
                    issue.component = "PaxPeer";
                    break;
                default:
                    issue.component = issue.component || (issue.epic && issues[issue.epic] && issues[issue.epic].component) || "Unknown";
            }
        });
        let issuesArray: Issue[] = Object.values(issues);
        if (issuesArray.length) await IssueModel.insertMany(issuesArray);
        return issues;
    }
}