import {composeWithMongoose} from 'graphql-compose-mongoose/node8';
import {prop, getModelForClass, arrayProp} from '@typegoose/typegoose';

class _Issue {
    @prop()
    key?: string;

    @prop()
    created?: Date;

    @prop()
    dueDate?: Date;

    @prop()
    resolutionDate?: Date;

    @prop()
    assignee?: string;

    @prop()
    timeSpent?: Number;

    @prop()
    timeOriginalEstimate?: Number;

    @prop()
    status?: string;
}

class SubIssue extends _Issue {
    parent?: string; //не @prop, только для сохранения
}


class Issue extends _Issue {

    @arrayProp({items: SubIssue})
    subIssues?: SubIssue[];

    @prop()
    component?: string;

    @prop()
    project?: string;

    @prop()
    epic?: string;

    @prop()
    category?: string;
}


const IssueModel = getModelForClass(Issue);
const IssueTC = composeWithMongoose(IssueModel, {});

export {_Issue, Issue, IssueModel, IssueTC, SubIssue};