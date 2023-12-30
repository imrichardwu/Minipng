import {LinkContainer} from "react-router-bootstrap";
import {Table, Button, Row, Col} from "react-bootstrap";
import {FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import {useParams} from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import {
    useGetProductsQuery,
    useDeleteProductMutation,
    useCreateProductMutation,
} from "../../slices/productsApiSlice";
import {toast} from "react-toastify";

import {Link} from "react-router-dom";
import styles from "./ProductListScreen.module.css";

function ProductListScreen() {
    const {pageNumber} = useParams();

    const {data, isLoading, error, refetch} = useGetProductsQuery({
        pageNumber,
    });

    const [deleteProduct, {isLoading: loadingDelete}] =
        useDeleteProductMutation();

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure")) {
            try {
                await deleteProduct(id);
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const [createProduct, {isLoading: loadingCreate}] =
        useCreateProductMutation();

    const createProductHandler = async () => {
        if (window.confirm("Are you sure you want to create a new product?")) {
            try {
                await createProduct();
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <>
            <div className={styles.container}>
                <h1>Products</h1>
                <button
                    onClick={createProductHandler}
                    className={styles.button}
                >
                    <FaPlus /> Create Product
                </button>
            </div>

            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error.data.message}</Message>
            ) : (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <Link
                                            to={`/admin/product/${product._id}/edit`}
                                            className={styles.button}
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                deleteHandler(product._id)
                                            }
                                            className={styles.button}
                                        >
                                            <FaTrash style={{color: "white"}} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Paginate
                        pages={data.pages}
                        page={data.page}
                        isAdmin={true}
                    />
                </>
            )}
        </>
    );
}

export default ProductListScreen;
