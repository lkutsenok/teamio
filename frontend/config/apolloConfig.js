import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {ApolloLink} from 'apollo-link';
import fetch from "node-fetch";
import _ from 'lodash'
import {API_URL} from "./config";

const client = new ApolloClient({
    link: ApolloLink.from([
        onError(({graphQLErrors, networkError}) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({message, locations, path}) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ),
                );
            if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        new HttpLink({
            fetch,
            uri: API_URL,
        })
    ]),
    cache: new InMemoryCache(),
    resolvers: {
        ResourcePlanItems: {
            componentName: resourcePlanItem => resourcePlanItem.component?.name || "Unknown",
            assigneeName: resourcePlanItem => resourcePlanItem.assignee.displayName,
            assigneeRole: resourcePlanItem => resourcePlanItem.assignee.role || "Нет направления",
        },
        ResourcePlan: {
            components: resourcePlan => _.uniq(resourcePlan.items.map(item => item.componentRef)),
            assignees: resourcePlan => _.uniq(resourcePlan.items.map(item => item.assigneeRef))
        }
    }
});

export {client}
