import { Pagination } from 'antd';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import searchParamsEnum from '../../Utils/searchParamsEnum';

const CustomPagination = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const totalDataCount = useSelector(store => store.books.count);

    const onPageChange = (pageNumber) => {
        // console.log(pageNumber);
        setSearchParams(params => {
            params.set(searchParamsEnum.PAGE, pageNumber);
            return params;
        })
    }
    if (totalDataCount) {
        return (
            <>
                <Pagination
                    style={{padding: "20px"}}
                    defaultCurrent={searchParams.get(searchParamsEnum.PAGE)}
                    current={searchParams.get(searchParamsEnum.PAGE)}
                    total={totalDataCount}
                    onChange={onPageChange}
                />
            </>
        );
    } else {
        return <></>;
    }

};
export default CustomPagination;