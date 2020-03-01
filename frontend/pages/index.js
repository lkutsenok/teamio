import React, {useState} from 'react'
import Layout from "../components/layout/Layout";
import PivotTableUI from 'react-pivottable/PivotTableUI';
// import {GET_HOURS_PER_ASSIGNEE} from "../graphql/getHoursPerAssignee";

const data = [
    {
        "component": "OTW",
        "assignee": "l.kutsenok",
        "hours": 5
    },
    {
        "component": "PaxPeer",
        "assignee": "katerina.f",
        "hours": 10
    },
    {
        "component": "PaxPeer",
        "assignee": "d.mamontova",
        "hours": 5
    },
    {
        "component": "RobotBull",
        "assignee": "d.mamontova",
        "hours": 24
    },
    {
        "component": "PaxPeer",
        "assignee": "m.sergeenkov",
        "hours": 4
    },
    {
        "component": "RobotBull",
        "assignee": "m.sergeenkov",
        "hours": 1
    },
    {
        "component": "HuseLock",
        "assignee": "katerina.f",
        "hours": 1
    },
    {
        "component": "FinTech",
        "assignee": "katerina.f",
        "hours": 22
    },
    {
        "component": "MedRavel",
        "assignee": "m.sergeenkov",
        "hours": 4
    },
    {
        "component": "RobotBull",
        "assignee": "d.gerasimova",
        "hours": 9
    },
    {
        "component": "RobotBull",
        "assignee": "a.volokh",
        "hours": 3
    },
    {
        "component": "PaxPeer",
        "assignee": "e.petrova",
        "hours": 6
    },
    {
        "component": "RobotBull",
        "assignee": "katerina.f",
        "hours": 6
    },
    {
        "component": "OTW",
        "assignee": "m.sergeenkov",
        "hours": 6
    },
    {
        "component": "RobotBull",
        "assignee": "l.kutsenok",
        "hours": 0.5
    },
    {
        "component": "OTW",
        "assignee": "a.sergeenkov",
        "hours": 11.5
    }
];

export default function Index() {
    const [_data, setData] = useState({});
    return (
        <Layout>
            <PivotTableUI
                data={data}
                onChange={s => setData(s)}
                {..._data}
            />
        </Layout>
    )
}

// Index.getInitialProps = async (ctx) => {
//
// };
