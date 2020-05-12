import React, {useState, useMemo, useRef} from 'react'
import {Card, Row, Col, DatePicker, Input, Form, Button} from "antd";
import moment from 'moment';
import dynamic from 'next/dynamic';
import {Bar} from 'react-chartjs-2';
import {useQuery} from "@apollo/react-hooks";
import {getStartOfCurrentMonth} from "../helpers/monthHelper";
import Layout from "../components/layout/Layout";
import {GET_HOURS_PER_ASSIGNEE} from "../graphql/getHoursPerAssignee";
import {BAR_COLORS} from "../config/chartColors";


const Pivot = dynamic(() => import('../components/webDataRocks/Pivot'), {ssr: false});

export default function Index() {
    const [dateRange, setDateRange] = useState({dateStart: getStartOfCurrentMonth(), dateEnd: moment().endOf('day')});
    const {error, loading, data, refetch, networkStatus} = useQuery(GET_HOURS_PER_ASSIGNEE, {
        notifyOnNetworkStatusChange: true
    });
    const datasets = useMemo(() => {
        return data ? data.hoursPerAssigneeChart.hours.map((data, i) => ({...data, ...BAR_COLORS[i]})) : []
    }, [data]);
    const webDataRocks = useRef(null)
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
                                <Form.Item label="Период">
                                    <DatePicker.RangePicker picker="week"
                                                            value={Object.values(dateRange)}
                                                            allowClear={false}
                                                            onChange={(dates) => setDateRange({
                                                                dateStart: dates[0],
                                                                dateEnd: dates[1]
                                                            })}
                                                            format={"DD.MM.YYYY"}/>
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
                            <Bar data={{
                                labels: data.hoursPerAssigneeChart.labels,
                                datasets
                            }} options={{
                                scales: {
                                    xAxes: [{stacked: true}],
                                    yAxes: [{stacked: true,}],
                                },
                                tooltips: {enabled: true},
                                maintainAspectRatio: false
                            }}
                                 height={300}

                            />
                        </Card>
                    </Col>
                </Row>
                <Card title={"Распределение трудозатрат по заказчикам"} size="small">
                    <Pivot handleMount={(obj) => webDataRocks.current = obj} toolbar={false} width="100%"
                           report={{
                               dataSource: {data: data.hoursPerAssignee},
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
            </>
            }
        </Layout>
    )
}


export const getServerSideProps = async (context) => {
    return {props: {}}
}
