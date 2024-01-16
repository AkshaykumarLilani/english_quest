import { Layout, Button, Flex, Space, Tooltip, Typography } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../Redux/AuthReducer/authSlice';
import { LogoutOutlined } from "@ant-design/icons";
import Title from 'antd/es/typography/Title';
const { Header } = Layout;

const { Text } = Typography;


const TopNavigation = () => {

    const currentUserEmail = useSelector(store => store.auth?.user?.email);
    const currentUserRole = useSelector(store => store.auth?.user?.role);

    const dispatch = useDispatch();

    return <>
        <Header
            style={{
                padding: 0,
                background: "#FFF",
            }}
        >
            <Flex justify='space-between' align='center'>
                <Flex align="center" justify="space-between" style={{ width: "100%" }}>
                    <Title style={{ margin: 0, paddingLeft: 20 }} level={4}>Library Manager</Title>
                    <div style={{lineHeight: "normal"}}>
                        <span>Email: {currentUserEmail}</span> <br />
                        <span>Role: {currentUserRole?.join?.(", ")}</span>
                    </div>
                    <Tooltip placement="bottom" title={"Logout"}>
                        <Button
                            type="text"
                            icon={<Space style={{ padding: "0px 10px" }} direction='horizontal'>
                                <LogoutOutlined size={24} />
                                {`Logout`}
                            </Space>}
                            onClick={() => { dispatch(logoutUser()); }}
                            style={{
                                fontSize: '16px',
                                width: "fit-content",
                                height: 64,
                            }}
                        />
                    </Tooltip>

                </Flex>
            </Flex>
        </Header>
    </>
}

export default TopNavigation;