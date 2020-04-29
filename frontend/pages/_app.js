import React from "react";
import {ApolloProvider} from '@apollo/react-hooks';
import {client} from "../config/apolloConfig";
import moment from "moment";
import 'moment/locale/ru'
import "antd/dist/antd.css";
import 'react-pivottable/pivottable.css';
import 'flexmonster/flexmonster.css'
import '../components/webDataRocks/pivot.css'

moment.locale('ru')

function App({Component, pageProps}) {
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    )
}

export default App
