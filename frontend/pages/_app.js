import React from "react";
import {ApolloProvider} from '@apollo/react-hooks';
import {client} from "../config/apolloConfig";
import "antd/dist/antd.css";
import 'react-pivottable/pivottable.css';
import '../components/pivotTable/pivotTable.css'

function App({Component, pageProps}) {
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    )
}

export default App