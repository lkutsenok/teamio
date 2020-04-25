import _ from 'lodash';
import {ImportInterface} from "./import";
import {_Issue, Issue, IssueModel, SubIssue} from "../models/Issue";
import {User, UserModel} from "../models/User";
import {jira} from "../jiraConfig";
import {Project, ProjectModel} from "../models/Project";
import {Component, ComponentModel, ProjectComponent} from "../models/Component";
import {Types} from "mongoose";
import {prop} from "@typegoose/typegoose";

const MAX_RESULTS = 1000;

export class JiraImport implements ImportInterface {

    static async getUsers() {
        const users = await jira.user.search({username: 'robotbull.com'})
        let _users: User[] = []
        for (const user of users) {
            _users.push({
                name: user.name,
                key: user.key,
                email: user.emailAddress,
                displayName: user.displayName,
            })
        }
        await UserModel.deleteMany({});
        await UserModel.insertMany(_users);
    }

    static async getProjects() {
        const projects = await jira.project.getProject({})
        let _projects: Project[] = []
        let _components: Component[] = []
        let components = [];
        for (const project of projects) {
            _projects.push({
                projectId: project.id,
                key: project.key,
                name: project.name
            })
            components = components.concat(await jira.project.getComponents({projectIdOrKey: project.id}))
        }
        await ProjectModel.deleteMany({})
        await ProjectModel.insertMany(_projects)
        components = _.groupBy(components, 'name')
        for (const component in components) {
            const d: ProjectComponent[] = components[component]
            const projectRefs: Types.ObjectId[] = []
            for (const projectComponent of d) {
                const project = await ProjectModel.findOne({projectId: projectComponent.projectId})
                projectRefs.push(project?._id)
            }
            _components.push({
                name: component,
                projectComponents: d.map((t, i) => ({componentId: t.id, projectRef: projectRefs[i]}))
            })
        }
        await ComponentModel.deleteMany({})
        await ComponentModel.insertMany(_components)
        return projects
    }

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
                project: Number(fields.project.id),
                assignee: fields.assignee && fields.assignee.name,
                status: fields.status && fields.status.name,
                created: fields.created,
                updated: fields.updated,
                dueDate: fields.duedate,
                component: fields.components.length && Number(fields.components[0].id),
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
        for (const issue of Object.values(issues)) {
            const project = await ProjectModel.findOne({projectId: issue.project})
            issue.projectRef = project?.id
            switch (project?.name) {
                case("MedRavel") :
                    issue.componentRef = (await ComponentModel.findOne({name: "MedRavel"}))?.id;
                    break;
                case("PlanSharing") :
                    issue.componentRef = (await ComponentModel.findOne({name: "PlanSharing"}))?.id;
                    break;
                case("PaxPeer") :
                    issue.componentRef = (await ComponentModel.findOne({name: "PaxPeer"}))?.id;
                    break;
                case("Huse Lock") :
                    issue.componentRef = (await ComponentModel.findOne({name: "HuseLock"}))?.id;
                    break;
                default:
                    issue.component = issue.component || (issue.epic && issues[issue.epic] && issues[issue.epic].component) || 0;
                    if (issue.component !== 0) {
                        issue.componentRef = (await ComponentModel.findOne({'projectComponents.componentId': issue.component}))?.id
                    }
            }
        }
        let issuesArray: Issue[] = Object.values(issues);
        IssueModel.deleteMany({}).exec();
        if (issuesArray.length) await IssueModel.insertMany(issuesArray);
        return issues;
    }
}
