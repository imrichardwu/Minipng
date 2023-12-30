import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Row, Col, Image, ListGroup, Card, Button, Form} from "react-bootstrap";
import {toast} from "react-toastify";
import {
    useGetProductDetailsQuery,
    useCreateReviewMutation,
} from "../slices/productsApiSlice";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import {addToCart} from "../slices/cartSlice";
import styles from "./ProductScreen.module.css";

const ProductScreen = () => {
    const {id: productId} = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const addToCartHandler = () => {
        dispatch(addToCart({...product, qty}));
        navigate("/cart");
    };

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);

    const {userInfo} = useSelector((state) => state.auth);

    const [createReview, {isLoading: loadingProductReview}] =
        useCreateReviewMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap();
            refetch();
            toast.success("Review created successfully");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <Link
                className={`${styles.btn} ${styles.btnLight} ${styles.my3}`}
                to="/"
            >
                Go Back
            </Link>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <Meta
                        title={product.name}
                        description={product.description}
                    />
                    <div className={styles.row}>
                        <div className={`${styles.col} ${styles.col6}`}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className={styles.imgFluid}
                            />
                        </div>
                        <div className={`${styles.col} ${styles.col3}`}>
                            <ul className={styles.listGroup}>
                                <li className={styles.listGroupItem}>
                                    <h3>{product.name}</h3>
                                </li>
                                <li className={styles.listGroupItem}>
                                    <Rating
                                        value={product.rating}
                                        text={`${product.numReviews} reviews`}
                                    />
                                </li>
                                <li className={styles.listGroupItem}>
                                    Price: ${product.price}
                                </li>
                                <li className={styles.listGroupItem}>
                                    Description: {product.description}
                                </li>
                            </ul>
                        </div>
                        <div className={`${styles.col} ${styles.col3}`}>
                            <div className={styles.card}>
                                <ul className={styles.listGroup}>
                                    <li className={styles.listGroupItem}>
                                        <div className={styles.row}>
                                            <div>Price:</div>
                                            <div>
                                                <strong>
                                                    ${product.price}
                                                </strong>
                                            </div>
                                        </div>
                                    </li>
                                    <li className={styles.listGroupItem}>
                                        <div className={styles.row}>
                                            <div>Status:</div>
                                            <div>
                                                {product.countInStock > 0
                                                    ? "In Stock"
                                                    : "Out Of Stock"}
                                            </div>
                                        </div>
                                    </li>
                                    {product.countInStock > 0 && (
                                        <li className={styles.listGroupItem}>
                                            <div className={styles.row}>
                                                <div>Qty</div>
                                                <div>
                                                    <select
                                                        value={qty}
                                                        onChange={(e) =>
                                                            setQty(
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    >
                                                        {[
                                                            ...Array(
                                                                product.countInStock
                                                            ).keys(),
                                                        ].map((x) => (
                                                            <option
                                                                key={x + 1}
                                                                value={x + 1}
                                                            >
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                    <li className={styles.listGroupItem}>
                                        <button
                                            className={`${styles.btn} ${styles.btnBlock}`}
                                            type="button"
                                            disabled={
                                                product.countInStock === 0
                                            }
                                            onClick={addToCartHandler}
                                        >
                                            Add To Cart
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.row} ${styles.review}`}>
                        <div className={`${styles.col} ${styles.col6}`}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && (
                                <Message>No Reviews</Message>
                            )}
                            <ul className={styles.listGroup}>
                                {product.reviews.map((review) => (
                                    <li
                                        className={styles.listGroupItem}
                                        key={review._id}
                                    >
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>
                                            {review.createdAt.substring(0, 10)}
                                        </p>
                                        <p>{review.comment}</p>
                                    </li>
                                ))}
                                <li className={styles.listGroupItem}>
                                    <h2>Write a Customer Review</h2>
                                    {loadingProductReview && <Loader />}
                                    {userInfo ? (
                                        <form onSubmit={submitHandler}>
                                            <div
                                                className={styles.formGroup}
                                                id="rating"
                                            >
                                                <label>Rating</label>
                                                <select
                                                    className={
                                                        styles.formControl
                                                    }
                                                    required
                                                    value={rating}
                                                    onChange={(e) =>
                                                        setRating(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select...
                                                    </option>
                                                    <option value="1">
                                                        1 - Poor
                                                    </option>
                                                    <option value="2">
                                                        2 - Fair
                                                    </option>
                                                    <option value="3">
                                                        3 - Good
                                                    </option>
                                                    <option value="4">
                                                        4 - Very Good
                                                    </option>
                                                    <option value="5">
                                                        5 - Excellent
                                                    </option>
                                                </select>
                                            </div>
                                            <div
                                                className={styles.formGroup}
                                                id="comment"
                                            >
                                                <label>Comment</label>
                                                <textarea
                                                    className={
                                                        styles.formControl
                                                    }
                                                    row="3"
                                                    required
                                                    value={comment}
                                                    onChange={(e) =>
                                                        setComment(
                                                            e.target.value
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                            <button
                                                disabled={loadingProductReview}
                                                className={styles.button}
                                                type="submit"
                                            >
                                                Submit
                                            </button>
                                        </form>
                                    ) : (
                                        <Message>
                                            Please{" "}
                                            <Link to="/login">sign in</Link> to
                                            write a review
                                        </Message>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ProductScreen;
