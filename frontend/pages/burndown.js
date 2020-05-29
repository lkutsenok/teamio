import React, {useState, useMemo, useRef} from 'react'
import {Card, Row, Col, DatePicker, Input, Form, Button, Select} from "antd";
import moment from 'moment';
import dynamic from 'next/dynamic';
import {Doughnut, Line, Pie} from 'react-chartjs-2';
import {useQuery} from "@apollo/react-hooks";
import {getStartOfCurrentMonth} from "../helpers/monthHelper";
import Layout from "../components/layout/Layout";
import {BAR_COLORS} from "../config/chartColors";
import {GET_BURNDOWN_CHART} from "../graphql/burndown/getBurndownChart";


const Pivot = dynamic(() => import('../components/webDataRocks/Pivot'), {ssr: false});

export default function Index() {
    const webDataRocks = useRef(null)
    const {error, loading, data, refetch, networkStatus} = useQuery(GET_BURNDOWN_CHART, {
        variables: {period: "2020-05-01"},
        notifyOnNetworkStatusChange: true
    });
    const datasets = useMemo(() => {
        return data ? [
            {
                data: data.burndownChart.estimate,
                label: "Оценочный",
                backgroundColor: '#ED4A7B',
                borderColor: '#ED4A7B',
                fill: false
            },
            {
                data: data.burndownChart.real,
                label: "Фактический",
                backgroundColor: '#5899DA',
                borderColor: '#5899DA',
                fill: false
            }
        ] : []
    }, [data]);
    return (
        <Layout>
            {!error && (networkStatus === 2 || !loading) &&
            <>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card title={"Период"} size="small">
                            <Form layout="vertical"
                                  initialValues={{size: 'middle'}}
                                  size={'middle'}
                                  style={{minHeight: 300}}
                            >
                                <Form.Item label="Период" style={{marginBottom: 5}}>
                                    <DatePicker.RangePicker picker="week"
                                        // value={Object.values(dateRange)}
                                                            allowClear={false}
                                                            onChange={(dates) => setDateRange({
                                                                dateStart: dates[0],
                                                                dateEnd: dates[1]
                                                            })}
                                                            format={"DD.MM.YYYY"}/>
                                </Form.Item>
                                <Form.Item label="Сотрудники" style={{marginBottom: 5}}>
                                    <Select mode="multiple"
                                            value={[1,2,3,4]}
                                            maxTagCount={0}>
                                        <Select.Option key={1}>{"aaaaaaaaaaaaaaa"}</Select.Option>
                                        <Select.Option key={2}>{"bbbbbbbbbbbbbbb"}</Select.Option>
                                        <Select.Option key={3}>{"aaaaaaaaaaaaaaa"}</Select.Option>
                                        <Select.Option key={4}>{"bbbbbbbbbbbbbbb"}</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Проекты">
                                    <Select mode="multiple"
                                            value={[1,2,3,4,5]}
                                            maxTagCount={0}>
                                        <Select.Option key={1}>{"aaaaaaaaaaaaaaa"}</Select.Option>
                                        <Select.Option key={2}>{"bbbbbbbbbbbbbbb"}</Select.Option>
                                        <Select.Option key={3}>{"aaaaaaaaaaaaaaa"}</Select.Option>
                                        <Select.Option key={4}>{"bbbbbbbbbbbbbbb"}</Select.Option>
                                        <Select.Option key={5}>{"aaaaaaaaaaaaaaa"}</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Button type="primary" block
                                        onClick={() => refetch(dateRange).then((data) => {
                                            webDataRocks.current.updateData({data: data.data.hoursPerAssignee})
                                        })}>
                                    Сохранить</Button>
                            </Form>
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card title={"График распределения трудозатрат по заказчикам"} size="small">
                            <Line data={{
                                labels: data.burndownChart.labels,
                                datasets
                            }} options={{
                                tooltips: {enabled: true},
                                maintainAspectRatio: false
                            }}
                                  height={300}

                            />
                        </Card>
                    </Col>
                    <Col span={6} style={{marginTop: 16}}>
                        <Card title={"Распределение трудозатрат"} size="small">
                            <Doughnut data={{
                                labels: ["Завершено", "В работе", "Не использовано"],
                                datasets: [{
                                    data: [10, 20, 30], backgroundColor: ['#5899DA', '#ED4A7B', '#6C8893']
                                }]
                            }} options={{
                                tooltips: {enabled: true},
                                maintainAspectRatio: false
                            }} height={300}/>
                        </Card>
                    </Col>
                    <Col span={18} style={{marginTop: 16, height: 300}}>
                        <Card title={"Распределение трудозатрат по заказчикам"} size="small">
                            <Pivot handleMount={(obj) => webDataRocks.current = obj} toolbar={false} width="100%"
                                   height="300px"
                                   report={{
                                       dataSource: {
                                           data: [{
                                               "assignee": "Кулатов Федор",
                                               "component": "CRM",
                                               "hoursPlan": 1,
                                               "hoursActual": 0.5,
                                               "__typename": "HoursPerAssignee"
                                           }, {
                                               "assignee": "Кулатов Федор",
                                               "component": "AdminPanel",
                                               "hoursPlan": 0.5,
                                               "hoursActual": 0.5,
                                               "__typename": "HoursPerAssignee"
                                           }, {
                                               "assignee": "Сурков Ерофей",
                                               "component": "AdminPanel",
                                               "hoursPlan": 0.5,
                                               "hoursActual": 0.5,
                                               "__typename": "HoursPerAssignee"
                                           }, {
                                               "assignee": "Ерастова Любава",
                                               "component": "App",
                                               "hoursPlan": 0.5,
                                               "hoursActual": 0.5,
                                               "__typename": "HoursPerAssignee"
                                           }, {
                                               "assignee": "Кулатов Федор",
                                               "component": "OSM",
                                               "hoursPlan": 0.5,
                                               "hoursActual": 0.5,
                                               "__typename": "HoursPerAssignee"
                                           }, {
                                               "assignee": "Ерастова Любава",
                                               "component": "OSM",
                                               "hoursPlan": 0.5,
                                               "hoursActual": 0.5,
                                               "__typename": "HoursPerAssignee"
                                           }, {
                                               "assignee": "Сурков Ерофей",
                                               "component": "Car",
                                               "hoursPlan": 0.5,
                                               "hoursActual": 0.5,
                                               "__typename": "HoursPerAssignee"
                                           }, {
                                               "assignee": "Ерастова Любава",
                                               "component": "Car",
                                               "hoursPlan": 0.5,
                                               "hoursActual": 0.5,
                                               "__typename": "HoursPerAssignee"
                                           }, {
                                               "assignee": "Сурков Ерофей",
                                               "component": "App",
                                               "hoursPlan": 0.5,
                                               "hoursActual": 0.5,
                                               "__typename": "HoursPerAssignee"
                                           }, {
                                               "assignee": "Петрова Елена",
                                               "component": "OSM",
                                               "hoursPlan": 0.5,
                                               "hoursActual": 0.5,
                                               "__typename": "HoursPerAssignee"
                                           }]
                                       },
                                       slice: {
                                           rows: [{uniqueName: "assignee", caption: "Исполнитель"}],
                                           columns: [{uniqueName: "component", caption: "Заказчик"}],
                                           measures: [
                                               {uniqueName: "hoursPlan", aggregation: "sum", format: "currency", active: false},
                                               {uniqueName: "hoursActual", aggregation: "sum", format: "currency", active: false},
                                               {
                                                   formula: '"hoursActual" / "hoursPlan"',
                                                   uniqueName: "Min Price",
                                                   caption: "% от плана",
                                                   grandTotalCaption: "% от плана",
                                                   format: "percent",
                                                   active: true,
                                                   calculateNaN: false
                                               }
                                           ]
                                       },
                                       formats: [{
                                           name: "percent",
                                           decimalPlaces: 1,
                                           isPercent: true,
                                           nullValue: "",
                                           infinityValue: "",
                                           divideByZeroValue: "",
                                       }],
                                   }}/>
                        </Card>
                    </Col>
                </Row>
            </>
            }
        </Layout>
    )
}

export const getServerSideProps = async (context) => {
    return {props: {}}
}
