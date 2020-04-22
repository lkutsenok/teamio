import {composeWithMongoose} from 'graphql-compose-mongoose/node8';
import {prop, getModelForClass, arrayProp, Ref} from '@typegoose/typegoose';
import {Project} from "./Project";
import {Component} from "./Component";

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

    project?: Number
    component?: Number

    @arrayProp({items: SubIssue})
    subIssues?: SubIssue[];

    @prop({ref: Project})
    componentRef?: Ref<Component>

    @prop({ref: Project})
    projectRef?: Ref<Project>

    @prop()
    epic?: string;

    @prop()
    category?: string;
}


const IssueModel = getModelForClass(Issue);
const IssueTC = composeWithMongoose(IssueModel, {});

export {_Issue, Issue, IssueModel, IssueTC, SubIssue};
