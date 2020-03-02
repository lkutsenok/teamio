import React, {useState, useMemo} from 'react'
import {Card, Row, Col, DatePicker, Input, Form, Button} from "antd";
import Layout from "../components/layout/Layout";
import PivotTableUI from 'react-pivottable/PivotTableUI';
import {aggregators} from 'react-pivottable/Utilities';
import {Bar} from 'react-chartjs-2';
import {useQuery} from "@apollo/react-hooks";
import {GET_HOURS_PER_ASSIGNEE} from "../graphql/getHoursPerAssignee";
import {BAR_COLORS} from "../config/chartColors";
import {getStartOfCurrentMonth} from "../helpers/monthHelper";
import moment from 'moment'

export default function Index() {
    const [_data, setData] = useState({});
    const [dateRange, setDateRange] = useState({dateStart: getStartOfCurrentMonth(), dateEnd: moment()});
    const {error, loading, data, refetch, networkStatus} = useQuery(GET_HOURS_PER_ASSIGNEE, {
        notifyOnNetworkStatusChange: true
    });
    const datasets = useMemo(() => {
        return data ? data.hoursPerAssigneeChart.hours.map((data, i) => ({...data, ...BAR_COLORS[i]})) : []
    }, [data]);
    return (
        <Layout>
            {!error && (networkStatus === 2 || !loading ) &&
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
                                <Button type="primary" block onClick={() => refetch(dateRange)}>Сохранить</Button>
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
                    <PivotTableUI
                        rows={['assignee']}
                        cols={['component']}
                        vals={['hours']}
                        hiddenAttributes={['hours', '__typename']}
                        aggregatorName="Sum"
                        aggregators={{Sum: aggregators.Sum}}
                        data={data.hoursPerAssignee}
                        onChange={s => setData(s)}
                        {..._data}
                    />
                </Card>
            </>}
        </Layout>
    )
}
