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

export default function Real() {
    return (
        <Layout>
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
                                                            format={"DD.MM.YYYY"}/>
                                </Form.Item>
                                <Form.Item label="Сотрудники" style={{marginBottom: 5}}>
                                    <Select mode="multiple"
                                            value={[1, 2, 3, 4]}
                                            maxTagCount={0}>
                                        <Select.Option key={1}>{"aaaaaaaaaaaaaaa"}</Select.Option>
                                        <Select.Option key={2}>{"bbbbbbbbbbbbbbb"}</Select.Option>
                                        <Select.Option key={3}>{"aaaaaaaaaaaaaaa"}</Select.Option>
                                        <Select.Option key={4}>{"bbbbbbbbbbbbbbb"}</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Проекты">
                                    <Select mode="multiple"
                                            value={[1, 2, 3, 4, 5]}
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
                        <Card title={"Распределение трудозатрат"} size="small">
                            <Doughnut data={{
                                labels: [
                                    "Работы в пределах нормы",
                                    "Работы с незначительным превышением нормы",
                                    "Работы со значительным превышением нормы"
                                ],
                                datasets: [{
                                    data: [60, 30, 10], backgroundColor: ['#5899DA', '#ED4A7B', '#6C8893']
                                }]
                            }} options={{
                                tooltips: {enabled: true},
                                maintainAspectRatio: false,
                                legend: {position: "left"}
                            }} height={300}/>
                        </Card>
                    </Col>
                    <Col span={24} style={{marginTop: 16}}>
                        <Card title={"График трудозатрат по закрытым задачам"} size="small">
                            <Line data={{
                                labels: ["1 мая", "2 мая", "3 мая", "4 мая", "5 мая", "6 мая", "7 мая"],
                                datasets: [
                                    {
                                        label: "Оценочные трудозатраты",
                                        data: [9, 7, 12, 13, 8, 9, 10],
                                        borderColor: '#ED4A7B',
                                        backgroundColor: 'rgba(237,74,123,0.5)',
                                    },
                                    {
                                        label: "Фактические трудозатраты",
                                        data: [9, 10, 12, 12, 8, 13, 12],
                                        backgroundColor: 'rgba(88,153,218,0.5)',
                                        borderColor: '#5899DA',
                                    },
                                ]
                            }} options={{
                                tooltips: {enabled: true},
                                maintainAspectRatio: false,
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            max: 16,
                                            min: 0
                                        }
                                    }]
                                }
                            }}
                                  height={300}

                            />
                        </Card>
                    </Col>
                </Row>
            </>
        </Layout>
    )
}

export const getServerSideProps = async (context) => {
    return {props: {}}
}
