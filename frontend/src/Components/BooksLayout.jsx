import { Layout } from 'antd';
import TopNavigation from './TopNavigation';

const { Content } = Layout;

const BooksLayout = ({ children }) => {

    return (
        <Layout style={{ height: "100svh" }}>
            <Layout>
                <TopNavigation />
                {/* <Breadcrumb
                    style={{
                        margin: '24px 0px 0px 16px',
                    }}
                >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb> */}
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: "#FFF",
                        borderRadius: 10,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
export default BooksLayout;