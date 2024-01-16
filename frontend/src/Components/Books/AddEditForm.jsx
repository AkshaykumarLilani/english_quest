import { useCallback, useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addARecord, fetchARecord } from '../../Redux/BooksReducer/bookSlices';
// import apiUrls from 'Utils/apiUrls';
import { FormModesEnum, asyncStatuses } from '../../Redux/enums';
import { LoadingOutlined } from "@ant-design/icons"

// eslint-disable-next-line react/prop-types
const AddEditForm = ({ apiUrl = "/books" }) => {
    const [notificationApi, contextHolder] = notification.useNotification();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const openNotification = useCallback((message, description, type) => {
        notificationApi[type]({
            message: message,
            description: description,
            placement: "top"
        });
    }, [notificationApi]);

    const currentFormMode = useSelector(store => store.books?.currentFormMode);
    const currentEditViewFormId = useSelector(store => store.books?.currentEditViewFormId);
    const fetchRecordStatus = useSelector(store => store.books?.fetchRecordStatus);
    const addRecordStatus = useSelector(store => store.books?.addRecordStatus);
    const currentRecordData = useSelector(store => store.books?.currentRecordData);

    useEffect(() => {
        if (addRecordStatus === asyncStatuses.SUCCESS) {
            form.resetFields();
        }
        return form.resetFields();
    }, [addRecordStatus, form]);

    useEffect(() => {
        // console.log({ fetchARecord, currentRecordData });
        form.setFieldsValue(currentRecordData);
    }, [fetchRecordStatus, currentRecordData, form]);

    useEffect(() => {
        // console.log({ "useEffect for currentEditViewFormId && currentFormMode": { currentEditViewFormId, currentFormMode } });
        if (currentEditViewFormId && (currentFormMode === FormModesEnum.EDIT || currentFormMode === FormModesEnum.VIEW)) {
            if (!currentEditViewFormId) {
                openNotification("Something went wrong", "Please contact developers. Id was not provided while changing modes", "error");
                return;
            } else {
                dispatch(fetchARecord({ apiUrl: apiUrl, id: currentEditViewFormId }));
            }
        }
    }, [currentEditViewFormId, currentFormMode, dispatch, apiUrl, openNotification]);

    const addNew = (val) => {
        // console.log(val);
        dispatch(addARecord({ apiUrl: apiUrl, data: val }));
    }

    const validatePublishedYear = (rule, value) => {
        const numericValue = Number(value);
        if (isNaN(numericValue) || numericValue < 0) {
            return Promise.reject('It must be a non-negative numeric value.');
        }

        if (numericValue < 1500) {
            return Promise.reject("It cannot be less than 1500")
        }

        const stringValue = String(value);
        const decimalIndex = stringValue.indexOf('.');
        // console.log({ decimalIndex })

        if (decimalIndex > -1) {
            return Promise.reject('It cannot contain decimal points.');
        }

        return Promise.resolve();
    };

    const onFinish = (val) => {
        delete val.confirm_password;
        val.username = val.email;
        if (currentFormMode === FormModesEnum.ADD) {
            addNew(val);
        } else {
            // console.log("No suitable mode found");
        }
    }
    return (
        <>
            {contextHolder}
            <Form layout="vertical"
                requiredMark={true}
                onFinish={onFinish}
                autoComplete="off"
                form={form}
                disabled={currentFormMode === FormModesEnum.VIEW}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter title',
                        },
                    ]}
                >
                    <Input placeholder="Please enter title" />
                </Form.Item>
                <Form.Item
                    name="author"
                    label="Author"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter author',
                        },
                    ]}
                >
                    <Input placeholder="Please enter author" />
                </Form.Item>
                <Form.Item
                    name="publishedYear"
                    label="Published Year"
                    rules={[
                        { required: true, message: 'Published Year is required.' },
                        { validator: validatePublishedYear },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>
                {
                    currentFormMode === FormModesEnum.ADD ? <Form.Item>
                        {
                            addRecordStatus === asyncStatuses.LOADING ?
                                <Button type="primary" htmlType="submit" disabled>
                                    <LoadingOutlined />
                                    Submitting
                                </Button> :
                                <Button type="primary" htmlType="submit" >
                                    Submit
                                </Button>
                        }
                    </Form.Item>  : <></>
                }

            </Form >
        </>
    );
};
export default AddEditForm;