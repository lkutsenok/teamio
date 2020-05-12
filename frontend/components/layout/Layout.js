import React, {useState} from "react";
import {Layout, Menu, Icon} from "antd";
import {BarChartOutlined, TableOutlined, ClockCircleOutlined, LineChartOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";

const {Header, Content, Footer, Sider} = Layout;

const LINKS = [
    {name: "Трудозатраты за период", icon: <BarChartOutlined/>, href: "/"},
    {name: "План ресурсов", icon: <TableOutlined/>, href: "/resource"},
    {name: "Использование ресурсов", icon: <LineChartOutlined/>, href: "/burndown"},
    {name: "Трудозатраты за период", icon: <ClockCircleOutlined/>, href: "/real"},
]

export default function Layout_(props) {
    const [collapsed, setCollapsed] = useState(true)
    const router = useRouter()
    return (
        <Layout>
            <Sider collapsible
                   collapsed={collapsed}
                   onCollapse={setCollapsed}
                   style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0}}>
                <div className="logo"/>
                <Menu theme="dark" mode="inline" onClick={(item) => router.push(LINKS[item.key].href)}>
                    {LINKS.map((link, i) => (
                        <Menu.Item key={i}>
                            {link.icon}
                            <span className="nav-text">{link.name}</span>
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout style={{marginLeft: collapsed ? 80 : 200, minHeight: "100vh"}}>
                <Header style={{background: '#fff', padding: 0}}/>
                <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                    {props.children}
                </Content>
                <Footer/>
            </Layout>
        </Layout>
    )
}
