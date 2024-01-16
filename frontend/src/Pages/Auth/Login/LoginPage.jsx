import { useCallback } from "react";
import styles from "./LoginPage.module.css";
import { Flex, Typography, Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAsync } from "../../../Redux/AuthReducer/authSlice";
import { asyncStatuses } from "../../../Redux/enums";
import { LoadingOutlined } from "@ant-design/icons";
import Video from "../../../Assets/Login/library.mp4";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const LoginPage = () => {
    const dispatch = useDispatch();

    const loginRequestStatus = useSelector(store => store.auth.status);

    const onFinish = useCallback((values) => {
        // console.log('Success:', values);
        dispatch(loginUserAsync(values));
    }, [dispatch]);

    const onFinishFailed = useCallback((errorInfo) => {
        // console.log('Failed:', errorInfo);
    }, []);

    return (
        <Flex align="center" className={styles.container}>
            <div className={styles.leftImageSection}>
                <video style={{width: "100%", height: "100%", objectFit: "cover", objectPosition:"center"}} playsInline autoPlay loop>
                    <source src={Video} type="video/mp4"/>
                </video>
            </div>
            <Flex justify="center" align="center" className={styles.rightFormSection}>
                <Flex gap={"middle"} vertical className={styles.rightLoginFormContainer}>
                    <div>
                        <Title> Login </Title>
                        <Text> Welcome back, please login to your account</Text>
                    </div>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                disabled={loginRequestStatus === asyncStatuses.LOADING ? true : false}
                                type="primary"
                                htmlType="submit"
                                style={{ width: "100%" }}
                            >
                                {
                                    loginRequestStatus === asyncStatuses.LOADING ? <>
                                        <LoadingOutlined /> Signing you in
                                    </> : <>
                                        Sign in
                                    </>
                                }
                            </Button>
                        </Form.Item>
                        Or <Link to={"/signup"}>Sign Up</Link>
                    </Form>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default LoginPage;