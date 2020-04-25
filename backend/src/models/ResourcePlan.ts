import {composeWithMongoose} from 'graphql-compose-mongoose/node8';
import {prop, getModelForClass, arrayProp, Ref} from '@typegoose/typegoose';
import {Component, ComponentTC} from "./Component";
import {Types} from "mongoose";
import {GraphQLString} from "graphql";

class ResourcePlanItem {
    @prop()
    assignee?: string

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

// setTimeout(() => {
//     new ResourcePlanModel({
//         period: new Date(),
//         version: 1,
//         items: [{
//             assignee: "l.kutsenok",
//             componentRef: Types.ObjectId('5ea34bc4b643ce3e0c9a80dc'),
//             hours: 10
//         }]
//     }).save()
// }, 1000)
