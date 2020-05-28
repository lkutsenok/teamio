import React from 'react'
import {Form, Input, Button, Checkbox, Row, Col, Card} from 'antd';
import {UserOutlined, LockOutlined, MailOutlined} from '@ant-design/icons';

export default function resetPassword() {
    const onFinish = values => {
        console.log('Received values of form: ', values);
    };

    return (
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh', background: "#f0f2f5"}}>
            <Col span={6} style={{background: "#fff"}}>
                <Card title={"Восстановление пароля"} size="small">
                    <Form
                        name="normal_login"
                        className="login-form"
                        style={{width: "100%"}}
                        initialValues={{remember: true}}
                        onFinish={onFinish}>
                        <Form.Item
                            name="username"
                            style={{marginBottom: 15}}
                            rules={[{required: true, message: 'Please input your Username!'}]}>
                            <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="Электронная почта"/>
                        </Form.Item>
                        {/*<Form.Item*/}
                        {/*    name="password"*/}
                        {/*    style={{marginBottom: 15}}*/}
                        {/*    rules={[{required: true, message: 'Please input your Password!'}]}>*/}
                        {/*    <Input*/}
                        {/*        prefix={<LockOutlined className="site-form-item-icon"/>}*/}
                        {/*        type="password"*/}
                        {/*        placeholder="Пароль"*/}
                        {/*    />*/}
                        {/*</Form.Item>*/}
                        <Form.Item  style={{marginBottom: 15}}>
                            <Button type="primary" htmlType="submit" className="login-form-button"
                                    style={{width: "100%"}}>Восстановить пароль
                            </Button>
                        </Form.Item>
                        {/*<Form.Item style={{marginBottom: 15}}>*/}
                        {/*    <a className="login-form-forgot" href="">Восстановление пароля</a>*/}
                        {/*    <a className="login-form-forgot" href="" style={{paddingLeft: 70}}>Регистрация</a>*/}
                        {/*</Form.Item>*/}
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};
