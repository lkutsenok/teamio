import React, {useState, useMemo, useRef, useEffect} from 'react'
import {Card, Row, Col, DatePicker, Spin, Form, Button, Select, Empty} from "antd";
import moment from "moment";
import _ from 'lodash'
import dynamic from 'next/dynamic';
import Layout from "../components/layout/Layout";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {GET_RESOURCE_PLAN} from "../graphql/resourcePlan/getResourcePlan";
import {UPDATE_RESOURCE_PLAN} from "../graphql/resourcePlan/updateResourcePlan";

const Pivot = dynamic(() => import('../components/webDataRocks/Pivot'), {ssr: false});

export default function Resource() {
    const pivotRef = useRef(null)
    const [pivotData, setPivotData] = useState([])
    const [rowData, setRowData] = useState({})
    const [selectedComponents, setSelectedComponents] = useState([])
    const [selectedAssignees, setSelectedAssignees] = useState([])
    const [period, setPeriod] = useState(moment().utc().startOf('month'))
    const {error, loading, data, refetch, networkStatus} = useQuery(GET_RESOURCE_PLAN, {
        variables: {period: moment().utc().startOf('month').toDate()},
        notifyOnNetworkStatusChange: true
    });
    const [updateResourcePlan] = useMutation(UPDATE_RESOURCE_PLAN)
    useEffect(() => {
        setRowData(data?.resourcePlan[0] ? _.keyBy(data?.resourcePlan[0]?.items, '_id') : {})
        setSelectedComponents(data?.resourcePlan[0]?.components || [])
        setSelectedAssignees(data?.resourcePlan[0]?.assignees || [])
    }, [data])
    useEffect(() => {
        setPivotData(Object.values(rowData))
    }, [rowData])
    useEffect(() => {
        pivotRef.current?.updateData({data: pivotData})
    }, [pivotData])
    const componentsOptions = useMemo(() => {
        return data ? data.components.map(data => (
            <Select.Option key={data._id}>{data.name}</Select.Option>)) : []
    }, [data]);
    const userOptions = useMemo(() => {
        return data ? data.users.map(data => (
            <Select.Option key={data._id}>{data.displayName}</Select.Option>)) : []
    }, [data]);
    const onMonthSelect = date => {
        setPeriod(date.utc())
        refetch({period: date.utc().startOf('month').toDate()})
    }
    const onSave = () => {
        updateResourcePlan({
            variables: {
                _id: data.resourcePlan[0]._id,
                items: Object.values(rowData).map(d => ({
                    assigneeRef: d.assigneeRef,
                    componentRef: d.componentRef,
                    hours: d.hours,
                }))
            }
        })
    }
    const onComponentAdd = componentRef => {
        setSelectedComponents([...selectedComponents, componentRef])
        let dataToAdd = {}
        const componentName = data.components.find(e => e._id === componentRef)?.name
        for (const assigneeRef of selectedAssignees) {
            const _id = (Math.random() * 1e20).toString(36);
            dataToAdd[_id] = {
                _id,
                assigneeRef,
                assigneeName: data.users.find(e => e._id === assigneeRef)?.displayName,
                assigneeRole: data.users.find(e => e._id === assigneeRef)?.role,
                hours: 0,
                componentRef,
                componentName,
            }
        }
        setRowData({...rowData, ...dataToAdd})
    }
    const onComponentRemove = componentRef => {
        setSelectedComponents([...selectedComponents.filter(d => d !== componentRef)])
        setRowData(_.pickBy(rowData, d => d.componentRef !== componentRef))
    }
    const onAssigneeAdd = assigneeRef => {
        setSelectedAssignees([...selectedAssignees, assigneeRef])
        let dataToAdd = {}
        const assignee = data.users.find(e => e._id === assigneeRef);
        for (const componentRef of selectedComponents) {
            const _id = (Math.random() * 1e20).toString(36);
            dataToAdd[_id] = {
                _id,
                assigneeRef,
                assigneeName: assignee?.displayName,
                assigneeRole: assignee?.role,
                hours: 0,
                componentRef,
                componentName: data.components.find(e => e._id === componentRef)?.name
            }
        }
        setRowData({...rowData, ...dataToAdd})
    }
    const onAssigneeRemove = assigneeRef => {
        setSelectedAssignees([...selectedAssignees.filter(d => d !== assigneeRef)])
        setRowData(_.pickBy(rowData, d => d.assigneeRef !== assigneeRef))
    }
    const onCellChange = d => {
        console.log(d)
        if (d.data?.[0]) {
            setRowData((rowData) => ({...rowData, [d.data[0].id]: {...rowData[d.data[0].id], hours: d.data[0].value}}))
        }
    }
    return (
        <Layout>
            <Card title={"Установка трудозатрат"} size="small">
                <Form layout="inline"
                      initialValues={{size: 'middle'}}
                      size={'middle'}>
                    <Form layout="inline"
                          initialValues={{size: 'middle'}}
                          size={'middle'}>
                        <Row gutter={24}>
                            <Col span={5}>
                                <Form.Item label="Период">
                                    <DatePicker.MonthPicker format={"MMMM YYYY"}
                                                            value={period}
                                                            onChange={onMonthSelect}/>
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item label="Заказчики">
                                    <Select mode="multiple"
                                            style={{minWidth: 200}}
                                            value={selectedComponents}
                                            onSelect={onComponentAdd}
                                            onDeselect={onComponentRemove}
                                            maxTagCount={0}>
                                        {componentsOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item label="Сотрудники">
                                    <Select mode="multiple"
                                            style={{minWidth: 200}}
                                            value={selectedAssignees}
                                            onSelect={onAssigneeAdd}
                                            onDeselect={onAssigneeRemove}
                                            maxTagCount={0}>
                                        {userOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Form>
            </Card>
            <Spin spinning={loading || networkStatus === 4}>
                <Card title={"Установка трудозатрат"}
                      size="small"
                      style={{minHeight: 182}}
                      extra={<Button type="primary" onClick={onSave}>Сохранить</Button>}>
                    {!loading && !error && <>
                        {pivotData.length ?
                            <Pivot handleMount={(obj) => pivotRef.current = obj}
                                   toolbar={false}
                                   width="100%"
                                   datachanged={(d) => onCellChange(d)}
                                   reportcomplete={() => document.querySelector('[title="Click to close"]')?.click()}
                                   report={{
                                       dataSource: {
                                           data: pivotData, mapping: {
                                               "_id": {
                                                   caption: "id",
                                                   type: 'id',
                                               },
                                               "assigneeRole": {
                                                   caption: "Направление",
                                                   type: "string",
                                               },
                                               "assigneeName": {
                                                   caption: "Исполнитель",
                                                   type: "string",
                                               },
                                               "componentName": {
                                                   caption: "Заказчик",
                                                   type: "string",
                                               },
                                               "hours": {
                                                   caption: "Часы",
                                                   type: "number",
                                               },
                                           },
                                       },
                                       options: {
                                           editing: true,
                                           grid: {type: "classic"}
                                       },
                                       slice: {
                                           rows: [{
                                               uniqueName: "assigneeRole",
                                           }, {uniqueName: "assigneeName"}],
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
                                   }}/> :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                                <span>Плана ресурсов на этот период еще нет</span>
                            }>
                                <Button type="primary">Создать</Button>
                            </Empty>}
                    </>}
                </Card>
            </Spin>
        </Layout>
    )
}
