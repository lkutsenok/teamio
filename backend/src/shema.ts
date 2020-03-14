import {schemaComposer} from 'graphql-compose';
import passport from 'passport';
import {IssueTC} from "./models/Issue";
import {UserTC} from "./models/User";
import {HoursPerAssigneeTC} from "./shemaTypes/hoursPerAssignee";
import {HoursPerAssigneeChartTC} from "./shemaTypes/hoursPerAssigneeChart";
import {LoginTC} from "./shemaTypes/login";

const authMiddleware = async (resolve, source, args, context, info) => {
    try {
        await new Promise((_resolve, reject) => passport.authenticate('jwt', {session: false}, (err, user) => {
            if (err || !user) reject('Invalid token');
            _resolve();
        })(context.req, context.res));
        return await resolve(source, args, context, info);
    } catch (e) {
        throw new Error(e);
    }
};

schemaComposer.Query.addFields({
    issues: IssueTC.getResolver('findMany', [authMiddleware]),
    hoursPerAssignee: HoursPerAssigneeTC.getResolver('get'),
    hoursPerAssigneeChart: HoursPerAssigneeChartTC.getResolver('get'),
});

schemaComposer.Mutation.addFields({
    login: LoginTC.getResolver('login'),
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;