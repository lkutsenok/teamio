import React from 'react'
import {Form, Input, Button, Checkbox, Row, Col, Card} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

export default function Login() {
    const onFinish = values => {
        console.log('Received values of form: ', values);
    };

    return (
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh', background: "#f0f2f5"}}>
            <Col span={6} style={{background: "#fff"}}>
                <Card title={"Авторизация"} size="small">
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
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Логин"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            style={{marginBottom: 15}}
                            rules={[{required: true, message: 'Please input your Password!'}]}>
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="Пароль"
                            />
                        </Form.Item>
                        <Form.Item  style={{marginBottom: 15}}>
                            <Button type="primary" htmlType="submit" className="login-form-button"
                                    style={{width: "100%"}}>Войти
                            </Button>
                        </Form.Item>
                        <Form.Item style={{marginBottom: 15}}>
                            <a className="login-form-forgot" href="">Восстановление пароля</a>
                            <a className="login-form-forgot" href="" style={{paddingLeft: 40}}>Регистрация</a>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};
