import React, {useState, useMemo, useRef} from 'react'
import {Card, Row, Col, DatePicker, Input, Form, Button} from "antd";
import moment from 'moment';
import dynamic from 'next/dynamic';
import {Line} from 'react-chartjs-2';
import {useQuery} from "@apollo/react-hooks";
import {getStartOfCurrentMonth} from "../helpers/monthHelper";
import Layout from "../components/layout/Layout";
import {BAR_COLORS} from "../config/chartColors";
import {GET_BURNDOWN_CHART} from "../graphql/burndown/getBurndownChart";


const Pivot = dynamic(() => import('../components/webDataRocks/Pivot'), {ssr: false});

export default function Index() {
    const {error, loading, data, refetch, networkStatus} = useQuery(GET_BURNDOWN_CHART, {
        variables: {period: "2020-04-01"},
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
            {data: data.burndownChart.real, label: "Фактический", backgroundColor: '#5899DA', borderColor: '#5899DA',fill: false}
        ] : []
    }, [data]);
    console.log(data)
    return (
        <Layout>
            {!error && (networkStatus === 2 || !loading) &&
            <>
                <Row gutter={16}>
                    {/*<Col span={6}>*/}
                    {/*    <Card title={"Период"} size="small">*/}
                    {/*        <Form layout="vertical"*/}
                    {/*              initialValues={{size: 'middle'}}*/}
                    {/*              size={'middle'}*/}
                    {/*              style={{minHeight: 300}}*/}
                    {/*        >*/}
                    {/*            <Form.Item label="Период">*/}
                    {/*                <DatePicker.RangePicker picker="week"*/}
                    {/*                                        value={Object.values(dateRange)}*/}
                    {/*                                        allowClear={false}*/}
                    {/*                                        onChange={(dates) => setDateRange({*/}
                    {/*                                            dateStart: dates[0],*/}
                    {/*                                            dateEnd: dates[1]*/}
                    {/*                                        })}*/}
                    {/*                                        format={"DD.MM.YYYY"}/>*/}
                    {/*            </Form.Item>*/}
                    {/*            <Button type="primary" block*/}
                    {/*                    onClick={() => refetch(dateRange).then((data) => {*/}
                    {/*                        webDataRocks.current.updateData({data: data.data.hoursPerAssignee})*/}
                    {/*                    })}>*/}
                    {/*                Сохранить</Button>*/}
                    {/*        </Form>*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
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
                </Row>
            </>
            }
        </Layout>
    )
}
