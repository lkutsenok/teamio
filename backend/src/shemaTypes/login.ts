import {schemaComposer} from "graphql-compose";
import passport from 'passport';
import {sign} from 'jsonwebtoken';

const LoginTC = schemaComposer.createObjectTC({
    name: "LoginData",
    fields: {
        accessToken: 'String',
    }
});

LoginTC.addResolver({
    kind: 'mutation',
    name: 'login',
    type: 'LoginData',
    args: {username: 'String!', password: 'String!'},
    resolve: async ({context, args}) => {
        context.req.body = args;
        try {
            const accessToken = await new Promise((resolve, reject) => passport.authenticate('local', {session: false}, (err, user) => {
                if (err || !user) return reject('No user found');
                context.req.login(user, {session: false}, (err) => {
                    if (err) reject(err);
                    resolve(sign(user.toObject(), 'secret', {expiresIn: "10h"}));
                });
            })(context.req, context.res));
            return {accessToken};
        } catch (e) {
            throw new Error(e);
        }
    }
});

export {LoginTC}