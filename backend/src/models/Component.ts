import {composeWithMongoose} from 'graphql-compose-mongoose/node8';
import {prop, getModelForClass, arrayProp, Ref} from '@typegoose/typegoose';
import {Project} from "./Project";

class ProjectComponent {
    projectId?: Number;
    id?: Number;

    @prop()
    componentId?: Number;

    @prop({ref: Project})
    projectRef?: Ref<Project>
}

class Component {
    @prop()
    name?: string;

    @arrayProp({items: ProjectComponent})
    projectComponents?: ProjectComponent[];
}


const ComponentModel = getModelForClass(Component);
const ComponentTC = composeWithMongoose(ComponentModel, {});

export {Component, ProjectComponent, ComponentModel, ComponentTC};
