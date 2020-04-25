import React, {useState, useMemo, useRef, useEffect} from 'react'
import {Card, Row, Col, DatePicker, Input, Form, Button, Select} from "antd";
import dynamic from 'next/dynamic';
import Layout from "../components/layout/Layout";
import {useQuery} from "@apollo/react-hooks";
import {GET_RESOURCE_PLAN} from "../graphql/getResourcePlan";
import {BAR_COLORS} from "../config/chartColors";


const Pivot = dynamic(() => import('../components/webDataRocks/Pivot'), {ssr: false});

export default function Resource() {
    const pivotRef = useRef(null)
    const [pivotData, setPivotData] = useState([])
    const {error, loading, data} = useQuery(GET_RESOURCE_PLAN);
    useEffect(() => {
        setPivotData(data?.resourcePlan[0]?.items || [])
    }, [data])
    useEffect(() => {
        pivotRef.current?.updateData({data: pivotData})
    }, [pivotData])
    const componentsOptions = useMemo(() => {
        return data ? data.components.map(data => (
            <Select.Option key={data._id}>{data.name}</Select.Option>)) : []
    }, [data]);
    const onDataChanged = () => {
        if (pivotRef) {
            console.log(pivotRef.current.getReport());
        }
    }
    const onComponentAdd = componentRef => {
        //TODO: для каждого юзера
        setPivotData([...pivotData, {
            assignee: 'l.kutsenok',
            hours: 0,
            componentRef,
            componentName: data.components.find(e => e._id === componentRef)?.name
        }])
    }
    const onComponentRemove = composeRef => {
        setPivotData([...pivotData.filter(d => d.componentRef !== composeRef)])
    }
    return (
        <Layout>
            {!loading && !error && <>
                <Card title={"Установка трудозатрат"} size="small">
                    <Form layout="horizontal"
                          initialValues={{size: 'middle'}}
                          size={'middle'}>
                        <Form layout="inline"
                              initialValues={{size: 'middle'}}
                              size={'middle'}>
                            <Row gutter={24}>
                                <Col span={6}>
                                    <Form.Item label="Период">
                                        <DatePicker.MonthPicker/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Заказчики">
                                        <Select mode="multiple"
                                                style={{minWidth: 200}}
                                                onSelect={onComponentAdd}
                                                onDeselect={onComponentRemove}
                                                maxTagCount={0}>
                                            {componentsOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Form>
                </Card>
                <Card title={"Установка трудозатрат"} size="small">
                    <Pivot handleMount={(obj) => pivotRef.current = obj} toolbar={false} width="100%"
                           datachanged={onDataChanged}
                           report={{
                               dataSource: {data: pivotData},
                               options: {
                                   editing: true,
                               },
                               slice: {
                                   rows: [{uniqueName: "assignee", caption: "Исполнитель"}],
                                   columns: [{uniqueName: "componentName", caption: "Заказчик"}],
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
            </>}
        </Layout>
    )
}
