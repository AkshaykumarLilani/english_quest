import { Link } from "react-router-dom";

import { Flex, Button } from "antd"

const PageNotFound = () => {

    return <Flex style={{ width: "100%", height: "70vh" }}>
        <Flex justify="center" align="center" style={{ width: "100%" }}>
            <Flex style={{ borderRight: "2px solid gray", padding: "20px" }}>
                <h1>404</h1>
            </Flex>
            <Flex vertical align="center" justify="start" style={{ padding: "20px" }}>
                <h4>Page Not Found</h4>
                <Button>
                    <Link to={`/`}>
                        Go Home
                    </Link>
                </Button>
            </Flex>
        </Flex>
    </Flex>
}

export default PageNotFound;