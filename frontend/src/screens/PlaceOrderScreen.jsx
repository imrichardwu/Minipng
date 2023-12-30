import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import {useDispatch, useSelector} from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import Loader from "../components/Loader";
import {useCreateOrderMutation} from "../slices/ordersApiSlice";
import {clearCartItems} from "../slices/cartSlice";
import styles from "./PlaceOrderScreen.module.css";

function PlaceOrderScreen() {
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);

    const [createOrder, {isLoading, error}] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate("/shipping");
        } else if (!cart.paymentMethod) {
            navigate("/payment");
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const dispatch = useDispatch();
    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(err);
        }
    };
    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <div className={styles.row}>
                <div className={styles.col8}>
                    <div className={styles.listGroup}>
                        <div className={styles.listGroupItem}>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address:</strong>
                                {cart.shippingAddress.address},{" "}
                                {cart.shippingAddress.city}{" "}
                                {cart.shippingAddress.postalCode},{" "}
                                {cart.shippingAddress.country}
                            </p>
                        </div>

                        <div className={styles.listGroupItem}>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </div>

                        <div className={styles.listGroupItem}>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? (
                                <Message>Your cart is empty</Message>
                            ) : (
                                <div className={styles.listGroup}>
                                    {cart.cartItems.map((item, index) => (
                                        <div
                                            className={styles.listGroupItem}
                                            key={index}
                                        >
                                            <div className={styles.row}>
                                                <div className={styles.col}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className={`${styles.imgFluid} ${styles.rounded}`}
                                                    />
                                                </div>
                                                <div className={styles.col}>
                                                    <Link
                                                        to={`/product/${item.product}`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </div>
                                                <div className={styles.col}>
                                                    {item.qty} x ${item.price} =
                                                    $
                                                    {(
                                                        item.qty * item.price
                                                    ).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <div className={styles.listGroup}>
                            <div className={styles.listGroupItem}>
                                <h2>Order Summary</h2>
                            </div>
                            <div className={styles.listGroupItem}>
                                <div className={styles.row}>
                                    <div className={styles.col}>Items</div>
                                    <div className={styles.col}>
                                        ${cart.itemsPrice}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.listGroupItem}>
                                <div className={styles.row}>
                                    <div className={styles.col}>Shipping</div>
                                    <div className={styles.col}>
                                        ${cart.shippingPrice}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.listGroupItem}>
                                <div className={styles.row}>
                                    <div className={styles.col}>Tax</div>
                                    <div className={styles.col}>
                                        ${cart.taxPrice}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.listGroupItem}>
                                <div className={styles.row}>
                                    <div className={styles.col}>Total</div>
                                    <div className={styles.col}>
                                        ${cart.totalPrice}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.listGroupItem}>
                                {error && (
                                    <Message variant="danger">
                                        {error.data.message}
                                    </Message>
                                )}
                            </div>
                            <div className={styles.listGroupItem}>
                                <button
                                    type="button"
                                    className={styles.btnBlock}
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </button>
                                {isLoading && <Loader />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PlaceOrderScreen;
