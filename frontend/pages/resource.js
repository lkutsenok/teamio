import React, {useState, useMemo, useRef} from 'react'
import {Card, Row, Col, DatePicker, Input, Form, Button} from "antd";
import dynamic from 'next/dynamic';
import Layout from "../components/layout/Layout";


const Pivot = dynamic(() => import('../components/webDataRocks/Pivot'), {ssr: false});

export default function Resource() {
    const pivotRef = useRef(null)
    const onReportComplete = () => {
    };
    const onDataChanged = () => {
        console.log(pivotRef, _data)
        if (pivotRef) {
            console.log(pivotRef.current.getReport());
        }
    }
    return (
        <Layout>
            <Card title={"Распределение трудозатрат по заказчикам"} size="small">
                <Pivot handleMount={(obj) => pivotRef.current = obj} toolbar={false} width="100%"
                       reportcomplete={onReportComplete}
                       datachanged={onDataChanged}
                       report={{
                           dataSource: {data: data.hoursPerAssignee},
                           options: {
                               editing: true,
                               // drillThrough: false,
                               showTotals: false,
                               showGrandTotals: false,
                           },
                           slice: {
                               rows: [{uniqueName: "assignee", caption: "Исполнитель"}],
                               columns: [{uniqueName: "component", caption: "Заказчик"}],
                               measures: [
                                   {
                                       uniqueName: "hours",
                                       aggregation: "sum",
                                       format: "currency"
                                   }]
                           },
                           formats: [{
                               name: "currency",
                               decimalPlaces: 0,
                           }],
                       }}/>
            </Card>
        </Layout>
    )
}
