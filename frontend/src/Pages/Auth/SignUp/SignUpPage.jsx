import { useCallback, useEffect } from "react";
import styles from "./SignUpPage.module.css";
import { Flex, Typography, Button, Form, Input, Select, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { signupUserAsync, resetSignUpStatus } from "../../../Redux/AuthReducer/authSlice";
import { asyncStatuses } from "../../../Redux/enums";
import { LoadingOutlined } from "@ant-design/icons";
import Video from "../../../Assets/Login/library.mp4";
import { Link, useNavigate } from "react-router-dom";
import { rolesEnum } from "../../../Utils/rolesEnum";

const { Title, Text } = Typography;

const options = [{
    label: rolesEnum.VIEWER,
    value: rolesEnum.VIEWER
}, {
    label: rolesEnum.VIEW_ALL,
    value: rolesEnum.VIEW_ALL
}, {
    label: rolesEnum.CREATOR,
    value: rolesEnum.CREATOR
}];

const SignUpPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [notificationApi, contextHolder] = notification.useNotification();
    const [thisForm] = Form.useForm();

    const signUpRequestStatus = useSelector(store => store.auth.signupStatus);
    const signUpRequestErrorMessage = useSelector(store => store.auth.errorMessage);

    useEffect(() => {
        const openNotification = (message, description, type) => {
            notificationApi[type]({
                message: message,
                description: description,
                placement: "top"
            });
        };
        if (signUpRequestStatus === asyncStatuses.SUCCESS) {
            openNotification("Sign up successful, please login", null, "success");
            thisForm.resetFields();
            dispatch(resetSignUpStatus());
            navigate("/");
        } else if (signUpRequestStatus === asyncStatuses.FAILED) {
            openNotification("Sign up failed", signUpRequestErrorMessage, "error");
            dispatch(resetSignUpStatus());
        } else {
            // loading or null
            // do nothing
        }
    }, [signUpRequestStatus, dispatch, notificationApi, signUpRequestErrorMessage]);

    const onFinish = useCallback((values) => {
        delete values.confirm_password;
        // console.log('Success:', values);
        dispatch(signupUserAsync(values));
    }, [dispatch]);

    const onFinishFailed = useCallback((errorInfo) => {
        console.log('Failed:', errorInfo);
    }, []);

    return (
        <>
            {contextHolder}
            <Flex align="center" className={styles.container}>
                <Flex justify="center" align="center" className={styles.leftFormSection}>
                    <Flex gap={"middle"} vertical className={styles.leftLoginFormContainer}>
                        <div>
                            <Title> Sign Up </Title>
                            <Text> Welcome, please fill in this form to create your account.</Text>
                        </div>
                        <Form
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            form={thisForm}
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
                                name="role"
                                label="Role"
                                initialValue={[options[2]]}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Role is required!',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Please select a role"
                                    options={options}
                                />
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

                            <Form.Item
                                label="Confirm Password"
                                name="confirm_password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('The two passwords do not match!');
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    disabled={signUpRequestStatus === asyncStatuses.LOADING ? true : false}
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: "100%" }}
                                >
                                    {
                                        signUpRequestStatus === asyncStatuses.LOADING ? <>
                                            <LoadingOutlined /> Signing you up
                                        </> : <>
                                            Sign up
                                        </>
                                    }
                                </Button>
                            </Form.Item>
                            Or <Link to={"/"}>Login</Link>
                        </Form>
                    </Flex>
                </Flex>
                <div className={styles.rightImageSection}>
                    <video style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} playsInline autoPlay loop>
                        <source src={Video} type="video/mp4" />
                    </video>
                </div>
            </Flex>
        </>
    );
}

export default SignUpPage;