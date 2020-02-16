import {schemaComposer} from 'graphql-compose';
import {IssueTC} from "./models/Issue";

schemaComposer.Query.addFields({
    issues: IssueTC.getResolver('findMany'),
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;