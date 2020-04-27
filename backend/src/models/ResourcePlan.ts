import {composeWithMongoose} from 'graphql-compose-mongoose/node8';
import {prop, getModelForClass, arrayProp, Ref} from '@typegoose/typegoose';
import {Component, ComponentTC} from "./Component";
import {Types} from "mongoose";
import {GraphQLString} from "graphql";
import {User, UserTC} from "./User";

class ResourcePlanItem {
    @prop({ref: User})
    assigneeRef?: Ref<User>

    @prop({ref: Component})
    componentRef?: Ref<Component>

    @prop()
    hours?: number

}

class ResourcePlan {
    @prop()
    period?: Date;

    @prop()
    version?: Number;

    @arrayProp({items: ResourcePlanItem})
    items?: ResourcePlanItem[];
}

const ResourcePlanModel = getModelForClass(ResourcePlan);
const ResourcePlanTC = composeWithMongoose(ResourcePlanModel, {});

export {ResourcePlan, ResourcePlanModel, ResourcePlanTC};

const ResourcePlanItemTC = ResourcePlanTC.getFieldTC('items');
ResourcePlanItemTC.addRelation(
    'component',
    {
        resolver: () => ComponentTC.getResolver('findById'),
        prepareArgs: {_id: (source) => source.componentRef},
        projection: {componentRef: 1}
    }
);
ResourcePlanItemTC.addRelation(
    'assignee',
    {
        resolver: () => UserTC.getResolver('findById'),
        prepareArgs: {_id: (source) => source.assigneeRef},
        projection: {assigneeRef: 1}
    }
);

setTimeout(() => {
    new ResourcePlanModel({
        period: new Date(),
        version: 1,
        items: [{
            assigneeRef: Types.ObjectId('5ea5d2e97acaa849aa9c709b'),
            componentRef: Types.ObjectId('5ea5d2e87acaa849aa9c7057'),
            hours: 10
        }]
    }).save()
}, 1000)
