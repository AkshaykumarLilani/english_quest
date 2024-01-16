import { Routes, Route, Navigate } from "react-router-dom";
import PageNotFound from "../Pages/PageNotFound";
import BooksLayout from "../Components/BooksLayout";
import BooksPage from "../Pages/BooksPage";

const ProtectedRoutes = () => {

    return (
        <BooksLayout>
            <Routes>
                <Route path="" element={<Navigate to={"/books"} />} />
                <Route path="books" element={<BooksPage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BooksLayout>
    );
}

export default ProtectedRoutes;