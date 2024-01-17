import { useCallback, useEffect, useState } from 'react';
import { Button, Drawer, Flex, Popconfirm, Space, Table, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Title from 'antd/es/typography/Title';
import { useSearchParams } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { fetchAllRecords, resetAddRecordStatus, resetDeleteRecordStatus, resetFetchRequestStatus, resetFormModeToNone, setFormModeAsAdd, setFormModeAsEdit, setFormModeAsView, deleteARecord, resetEditRecordStatus } from '../Redux/BooksReducer/bookSlices';
import AddEditForm from '../Components/Books/AddEditForm';
import CustomPagination from '../Components/Books/CustomPagination';
import { FormModesEnum, asyncStatuses } from '../Redux/enums';
import searchParamsEnum from '../Utils/searchParamsEnum';
import { PlusCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
import { rolesEnum } from '../Utils/rolesEnum';

const apiUrl = "/books";

const BooksPage = () => {
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState(false);
    const [notificationApi, contextHolder] = notification.useNotification();

    const currentFormMode = useSelector(store => store.books?.currentFormMode);
    const currentEditViewFormId = useSelector(store => store.books?.currentEditViewFormId);
    const currentUserRole = useSelector(store => store?.auth?.user?.role);

    const openNotification = useCallback((message, description, type) => {
        notificationApi[type]({
            message: message,
            description: description,
            placement: "top"
        });
    }, [notificationApi])

    const changeFormMode = useCallback((newMode, id) => {
        if (newMode !== FormModesEnum.ADD && newMode !== FormModesEnum.NONE) {
            if (!id) {
                openNotification("Something went wrong", "Please contact developers. Id was not provided while changing modes", "error");
                return;
            }
            if (Object.keys(FormModesEnum).includes(newMode)) {
                setOpen(true);
                if (newMode === FormModesEnum.EDIT) {
                    dispatch(setFormModeAsEdit({ id: id }));
                } else if (newMode === FormModesEnum.VIEW) {
                    dispatch(setFormModeAsView({ id: id }));
                }
            } else {
                openNotification("Something went wrong", "Please contact developers. Provided mode does not exist.", "error");
                return;
            }
        } else if (newMode === FormModesEnum.ADD) {
            setOpen(true);
            dispatch(setFormModeAsAdd());
        }
    }, [dispatch, openNotification])

    useEffect(() => {
        // console.log({ currentEditViewFormId, currentFormMode });
        if (currentFormMode !== FormModesEnum.NONE) {
            changeFormMode(currentFormMode, currentEditViewFormId);
        }
    }, [currentFormMode, currentEditViewFormId, changeFormMode]);



    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Published Year',
            dataIndex: 'publishedYear',
            key: 'publishedYear',
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
            render: (text, row) => {
                return <Space direction="vertical" style={{ gap: 0 }}>
                    <span>{row?.createdAt ? moment(row.createdAt).format("DD MMM yyyy, hh:mm a") : ""}</span>
                </Space>
            },
        },
        {
            title: 'Updated',
            dataIndex: 'updated',
            key: 'updated',
            render: (text, row) => {
                return <Space direction="vertical" style={{ gap: 0 }}>
                    <span>{row?.updatedAt ? moment(row.updatedAt).format("DD MMM yyyy, hh:mm a") : ""}</span>
                </Space>
            },
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, row) => {
                const isCurrentUserACreator = currentUserRole?.filter?.(r => r === rolesEnum.CREATOR).length > 0;

                if (isCurrentUserACreator) {
                    return <Space direction="horizontal">
                        <Button type="default" shape="circle" icon={<EditOutlined />} size="small" onClick={(event) => {
                            // // console.log({event});
                            dispatch(setFormModeAsEdit({ id: row._id }));
                            event.stopPropagation();
                        }} />
                        <Popconfirm
                            title="Delete"
                            description="Are you sure to delete this book?"
                            onConfirm={() => {
                                dispatch(deleteARecord({ apiUrl: apiUrl, id: row?._id }));
                            }}
                            onCancel={() => {
                                //console.log(e)
                            }}
                            icon={
                                <QuestionCircleOutlined
                                    style={{
                                        color: 'red',
                                    }}
                                />
                            }
                        >
                            <Button type="default" color="red" shape="circle" danger icon={<DeleteOutlined />} size="small" />
                        </Popconfirm>
                    </Space>
                } else {
                    return <>-</>
                }
            },
        },
    ]

    const resetFormMode = useCallback(() => {
        setOpen(false);
        dispatch(resetFormModeToNone());
    }, [dispatch])


    const data = useSelector(store => store.books.data);
    const dataTotalCount = useSelector(store => store.books.count);

    const fetchRequestStatus = useSelector(store => store.books.fetchRequestStatus);
    const fetchRequestErrorMessage = useSelector(store => store.books.fetchRequestErrorMessage);
    const deleteRecordStatus = useSelector(store => store.books.deleteRecordStatus);
    const addRecordStatus = useSelector(store => store.books.addRecordStatus);
    const editRecordStatus = useSelector(store => store.books.editRecordStatus);

    useEffect(() => {
        let currentPageNumber = searchParams.get(searchParamsEnum.PAGE) || 1;
        let new_ = searchParams.get(searchParamsEnum.NEW);
        let old_ = searchParams.get(searchParamsEnum.OLD);
        if (!new_ && !old_){
            setSearchParams(params => {
                params.set(searchParamsEnum.PAGE, currentPageNumber)
                return params;
            });
        }
        
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        if (apiUrl) {
            // console.log({ searchParams })
            dispatch(fetchAllRecords({ apiUrl, searchParams }));
        }
    }, [dispatch, searchParams]);

    const fetchLessThan10MinutesOld = () => {
        setSearchParams(params => {
            params.delete(searchParamsEnum.PAGE);
            params.delete(searchParamsEnum.OLD);
            params.set(searchParamsEnum.NEW, 1);
            return params;
        });
    }

    const fetchMoreThan10MinutesOld = () => {
        setSearchParams(params => {
            params.delete(searchParamsEnum.PAGE);
            params.delete(searchParamsEnum.NEW);
            params.set(searchParamsEnum.OLD, 1);
            return params;
        });
    }

    useEffect(() => {
        if (fetchRequestStatus && fetchRequestStatus !== asyncStatuses.LOADING) {
            setTimeout(() => dispatch(resetFetchRequestStatus()), 300);
            if (fetchRequestStatus === asyncStatuses.FAILED) {
                openNotification("Error occurred ", fetchRequestErrorMessage, "error")
            }
        }
        if (deleteRecordStatus && deleteRecordStatus === asyncStatuses.SUCCESS) {
            setTimeout(() => {
                dispatch(resetDeleteRecordStatus());
                dispatch(fetchAllRecords({ apiUrl, searchParams }));
                openNotification(`Successfully deleted the Book.`, null, "success");
            }, 300);
        }
        if (deleteRecordStatus && deleteRecordStatus === asyncStatuses.FAILED) {
            setTimeout(() => {
                dispatch(resetDeleteRecordStatus());
                openNotification(`Error while deleting the Book.`, null, "error");
            }, 300);
        }
        if (addRecordStatus && addRecordStatus === asyncStatuses.SUCCESS) {
            setTimeout(() => {
                dispatch(resetAddRecordStatus());
                resetFormMode();
                dispatch(fetchAllRecords({ apiUrl, searchParams }));
                openNotification(`Successfully added new Book.`, null, "success");
            }, 300);
        }
        if (addRecordStatus && addRecordStatus === asyncStatuses.FAILED) {
            setTimeout(() => {
                dispatch(resetAddRecordStatus());
                openNotification(`Error while adding the Book.`, null, "error");
            }, 300);
        }
        if (editRecordStatus && editRecordStatus === asyncStatuses.SUCCESS) {
            dispatch(resetEditRecordStatus());
            resetFormMode();
            dispatch(fetchAllRecords({ apiUrl, searchParams }));
            openNotification("Updated", null, "success");
            setTimeout(() => dispatch(resetEditRecordStatus()), 300);
        }
        if (editRecordStatus && editRecordStatus === asyncStatuses.FAILED) {
            setTimeout(() => {
                dispatch(resetEditRecordStatus());
                openNotification(`Error while editing the Book`, null, "error");
            }, 300);
        }
    }, [fetchRequestStatus, editRecordStatus, deleteRecordStatus, dispatch, addRecordStatus, searchParams, openNotification, resetFormMode, fetchRequestErrorMessage]);

    return (<>
        {contextHolder}
        <Title level={2}>Books</Title>
        <Flex vertical align='start' justify='space-between'>
            <Flex justify='space-between' align='center' style={{ width: "100%", padding: "10px 0px" }}>
                <Title style={{ margin: 0 }} level={5}>Total: {dataTotalCount || 0}</Title>
                {
                    currentUserRole?.filter?.(r => r === rolesEnum.CREATOR).length > 0 ? <Flex gap={5}>
                        <Button type="primary" onClick={fetchLessThan10MinutesOld} >
                            {"< 10 Minutes Old"}
                        </Button>
                        <Button type="primary" onClick={fetchMoreThan10MinutesOld} >
                            {"> 10 Minutes Old"}
                        </Button>
                        <Button type="primary" onClick={() => changeFormMode(FormModesEnum.ADD, null)} icon={<PlusCircleOutlined />}>
                            Add Book
                        </Button>
                    </Flex> : <></>
                }
            </Flex>
            <Table
                onRow={(record) => {
                    return {
                        onClick: (event) => {
                            // console.log({ record, event });
                            if (event.target.localName === "td") {
                                dispatch(setFormModeAsView({ id: record._id || record.uuid }));
                            }
                        }, // click row
                        // onDoubleClick: (event) => { }, // double click row
                        // onContextMenu: (event) => { }, // right button click row
                        // onMouseEnter: (event) => { }, // mouse enter row
                        // onMouseLeave: (event) => { }, // mouse leave row
                    };
                }}
                columns={columns}
                dataSource={data}
                size='small'
                loading={fetchRequestStatus === asyncStatuses.LOADING}
                scroll={{
                    y: "65svh",
                    x: "100%"
                }}
                pagination={false}
            />
            <Flex justify='center' align='center' style={{ width: "100%" }}>
                <CustomPagination />
            </Flex>
        </Flex>
        <Drawer
            title={`${currentFormMode === FormModesEnum.ADD ? 'Create a new' : currentFormMode === FormModesEnum.EDIT ? 'Edit a' : currentFormMode === FormModesEnum.VIEW ? 'View a' : ''} Book`}
            width={"fit-content"}
            style={{ minWidth: "30vw" }}
            onClose={resetFormMode}
            open={open}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
        >
            <AddEditForm
                changeFormMode={changeFormMode}
                apiUrl={apiUrl}
            />
        </Drawer>
    </>)
}

export default BooksPage;