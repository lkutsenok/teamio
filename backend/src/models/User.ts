import {composeWithMongoose} from 'graphql-compose-mongoose/node8';
import {prop, getModelForClass} from '@typegoose/typegoose';

class User {
    @prop()
    username?: string;
}

const UserModel = getModelForClass(User);
const UserTC = composeWithMongoose(UserModel, {});

// UserModel.create({username: "test"}, () => {});

export {User, UserModel, UserTC};