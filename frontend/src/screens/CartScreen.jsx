// CartScreen.jsx
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {FaTrash} from "react-icons/fa";
import Message from "../components/Message";
import {addToCart, removeFromCart} from "../slices/cartSlice";
import styles from "./CartScreen.module.css";

function CartScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const {cartItems} = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({...product, qty}));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping");
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.column} ${styles.column - 8}`}>
                <h1 style={{marginBottom: "20px"}}>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message>
                        Your cart is empty <Link to="/">Go Back</Link>
                    </Message>
                ) : (
                    <ul className={styles.list}>
                        {cartItems.map((item) => (
                            <li className={styles.listItem} key={item._id}>
                                <div className={styles.container}>
                                    <div
                                        className={`${styles.column} ${
                                            styles.column - 2
                                        }`}
                                    >
                                        <img
                                            className={styles.image}
                                            src={item.image}
                                            alt={item.name}
                                        />
                                    </div>
                                    <div
                                        className={`${styles.column} ${styles.column3}`}
                                    >
                                        <Link
                                            className={styles.link}
                                            to={`/product/${item._id}`}
                                        >
                                            {item.name}
                                        </Link>
                                    </div>
                                    <div
                                        className={`${styles.column} ${styles.column2}`}
                                    >
                                        ${item.price}
                                    </div>
                                    <div
                                        className={`${styles.column} ${styles.column2}`}
                                    >
                                        <select
                                            value={item.qty}
                                            onChange={(e) =>
                                                addToCartHandler(
                                                    item,
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {[
                                                ...Array(
                                                    item.countInStock
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
                                    <div
                                        className={`${styles.column} ${styles.column2}`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromCartHandler(item._id)
                                            }
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className={`${styles.column} ${styles.column4}`}>
                <div>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>
                            <h2>
                                Subtotal (
                                {cartItems.reduce(
                                    (acc, item) => acc + item.qty,
                                    0
                                )}
                                ) items
                            </h2>
                            $
                            {cartItems
                                .reduce(
                                    (acc, item) => acc + item.qty * item.price,
                                    0
                                )
                                .toFixed(2)}
                        </li>
                        <li className={styles.listItem}>
                            <button
                                type="button"
                                className={`${styles.button}`}
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                                Proceed To Checkout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CartScreen;
