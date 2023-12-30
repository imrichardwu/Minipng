import {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
    useDeliverOrderMutation,
    useGetOrderDetailsQuery,
    useGetPaypalClientIdQuery,
    usePayOrderMutation,
} from "../slices/ordersApiSlice";
import styles from "./OrderScreen.module.css";

function OrderScreen() {
    const {id: orderId} = useParams();

    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery(orderId);

    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();

    const [deliverOrder, {isLoading: loadingDeliver}] =
        useDeliverOrderMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,
    } = useGetPaypalClientIdQuery();

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD",
                    },
                });
                paypalDispatch({type: "setLoadingStatus", value: "pending"});
            };
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPaypalScript();
                }
            }
        }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({orderId, details});
                refetch();
                toast.success("Order is paid");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        });
    }

    function onError(err) {
        toast.error(err.message);
    }

    function createOrder(data, actions) {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {value: order.totalPrice},
                    },
                ],
            })
            .then((orderID) => {
                return orderID;
            });
    }

    const deliverHandler = async () => {
        await deliverOrder(orderId);
        refetch();
    };

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
    ) : (
        <div>
            <h1>Order {order._id}</h1>
            <div className={styles.row}>
                <div className={styles.colMd8}>
                    <div className={styles.listGroup}>
                        <div>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>{" "}
                                <a href={`mailto:${order.user.email}`}>
                                    {order.user.email}
                                </a>
                            </p>
                            <p>
                                <strong>Address:</strong>
                                {order.shippingAddress.address},{" "}
                                {order.shippingAddress.city}{" "}
                                {order.shippingAddress.postalCode},{" "}
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant="success">
                                    Delivered on {order.deliveredAt}
                                </Message>
                            ) : (
                                <Message variant="danger">
                                    Not Delivered
                                </Message>
                            )}
                        </div>

                        <div>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant="success">
                                    Paid on {order.paidAt}
                                </Message>
                            ) : (
                                <Message variant="danger">Not Paid</Message>
                            )}
                        </div>

                        <div>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? (
                                <Message>Order is empty</Message>
                            ) : (
                                <div className={styles.listGroup}>
                                    {order.orderItems.map((item, index) => (
                                        <div key={index}>
                                            <div className={styles.row}>
                                                <div className={styles.colMd1}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className={
                                                            styles.fluidRounded
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Link
                                                        to={`/product/${item.product}`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </div>
                                                <div className={styles.colMd4}>
                                                    {item.qty} x ${item.price} =
                                                    ${item.qty * item.price}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.colMd4}>
                    <div className={styles.card}>
                        <div className={styles.listGroup}>
                            <div>
                                <h2>Order Summary</h2>
                            </div>
                            <div>
                                <div className={styles.row}>
                                    <div>Items</div>
                                    <div>${order.itemsPrice}</div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.row}>
                                    <div>Shipping</div>
                                    <div>${order.shippingPrice}</div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.row}>
                                    <div>Tax</div>
                                    <div>${order.taxPrice}</div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.row}>
                                    <div>Total</div>
                                    <div>${order.totalPrice}</div>
                                </div>
                            </div>
                            {!order.isPaid && (
                                <div>
                                    {loadingPay && <Loader />}

                                    {isPending ? (
                                        <Loader />
                                    ) : (
                                        <div>
                                            <div>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {loadingDeliver && <Loader />}

                            {userInfo &&
                                userInfo.isAdmin &&
                                order.isPaid &&
                                !order.isDelivered && (
                                    <div>
                                        <button
                                            type="button"
                                            className={styles.btnBlock}
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderScreen;
