import {composeWithMongoose} from 'graphql-compose-mongoose/node8';
import {prop, getModelForClass, DocumentType} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

class User {
    @prop()
    name?: string;

    @prop()
    key?: string;

    @prop()
    email?: string;

    @prop()
    displayName?: string;

    @prop()
    password?: string;

    static async createUser(username: string, password: string) {
        const encryptedPassword = bcrypt.hashSync(password, 8);
        return await new UserModel({username, password: encryptedPassword}).save()
    }

    static async validatePassword(user: DocumentType<User>, password: string) {
        return bcrypt.compareSync(password, user.password);
    }
}

const UserModel = getModelForClass(User);
const UserTC = composeWithMongoose(UserModel, {});

export {User, UserModel, UserTC};
