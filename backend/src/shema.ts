import {schemaComposer} from 'graphql-compose';
import {IssueTC} from "./models/Issue";
import {HoursPerAssigneeTC} from "./shemaTypes/hoursPerAssignee";

schemaComposer.Query.addFields({
    issues: IssueTC.getResolver('findMany'),
    hoursPerAssignee: HoursPerAssigneeTC.getResolver('get')
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;