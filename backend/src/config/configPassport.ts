import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt'
import {UserModel} from "../models/User";

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        UserModel.findOne({username: username}).exec().then(user => {
            if (!user) return done(null, false);
            // if (!user.verifyPassword(password)) return done(null, false);
            return done(null, user)
        }).catch(e => done(e));
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: 'secret'
    }, (jwtPayload, done) => {
        return UserModel.findById(jwtPayload._id).exec().then(user => {
            if (!user) return done(null, false);
            return done(null, user)
        }).catch(e => {
            console.log(e);
            done(e)
        });
    }
));