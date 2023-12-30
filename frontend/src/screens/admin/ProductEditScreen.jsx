import {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import {toast} from "react-toastify";
import {
    useGetProductDetailsQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import styles from "./ProductEditScreen.module.css";

const ProductEditScreen = () => {
    const {id: productId} = useParams();

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);

    const [updateProduct, {isLoading: loadingUpdate}] =
        useUpdateProductMutation();

    const [uploadProductImage, {isLoading: loadingUpload}] =
        useUploadProductImageMutation();

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
            }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
            toast.success("Product updated");
            refetch();
            navigate("/admin/productlist");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <Link to="/admin/productlist" className={styles.button}>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error.data.message}</Message>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.formControl}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Price</label>
                            <input
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className={styles.formControl}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Image</label>
                            <input
                                type="text"
                                placeholder="Enter image url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className={styles.formControl}
                            />
                            <input
                                label="Choose File"
                                onChange={uploadFileHandler}
                                type="file"
                                className={styles.formControl}
                            />
                            {loadingUpload && <Loader />}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Brand</label>
                            <input
                                type="text"
                                placeholder="Enter brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className={styles.formControl}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Count In Stock</label>
                            <input
                                type="number"
                                placeholder="Enter countInStock"
                                value={countInStock}
                                onChange={(e) =>
                                    setCountInStock(e.target.value)
                                }
                                className={styles.formControl}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Category</label>
                            <input
                                type="text"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={styles.formControl}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <input
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={styles.formControl}
                            />
                        </div>

                        <button type="submit" className={styles.button}>
                            Update
                        </button>
                    </form>
                )}
            </FormContainer>
        </>
    );
};

export default ProductEditScreen;
