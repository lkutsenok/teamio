import {composeWithMongoose} from 'graphql-compose-mongoose/node8';
import {prop, getModelForClass} from '@typegoose/typegoose';

class Project {
    @prop()
    key?: string;

    @prop()
    projectId?: Number;

    @prop()
    name?: string;
}


const ProjectModel = getModelForClass(Project);
const ProjectTC = composeWithMongoose(ProjectModel, {});

export {Project, ProjectModel, ProjectTC};
