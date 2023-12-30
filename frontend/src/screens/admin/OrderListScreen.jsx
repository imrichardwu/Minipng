import {FaTimes} from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {useGetOrdersQuery} from "../../slices/ordersApiSlice";
import styles from "./OrderListScreen.module.css";
import {Link} from "react-router-dom";

const OrderListScreen = () => {
    const {data: orders, isLoading, error} = useGetOrdersQuery();

    return (
        <>
            <h1>Orders</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <table className={styles.tableSm}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th className={styles.tableTh}>ID</th>
                            <th className={styles.tableTh}>USER</th>
                            <th className={styles.tableTh}>DATE</th>
                            <th className={styles.tableTh}>TOTAL</th>
                            <th className={styles.tableTh}>PAID</th>
                            <th className={styles.tableTh}>DELIVERED</th>
                            <th className={styles.tableTh}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className={styles.tableTd}>{order._id}</td>
                                <td className={styles.tableTd}>
                                    {order.user && order.user.name}
                                </td>
                                <td className={styles.tableTd}>
                                    {order.createdAt.substring(0, 10)}
                                </td>
                                <td className={styles.tableTd}>
                                    {order.totalPrice}
                                </td>
                                <td className={styles.tableTd}>
                                    {order.isPaid ? (
                                        order.paidAt.substring(0, 10)
                                    ) : (
                                        <FaTimes style={{color: "red"}} />
                                    )}
                                </td>
                                <td className={styles.tableTd}>
                                    {order.isDelivered ? (
                                        order.deliveredAt.substring(0, 10)
                                    ) : (
                                        <FaTimes style={{color: "red"}} />
                                    )}
                                </td>
                                <td className={styles.tableTd}>
                                    <Link
                                        to={`/order/${order._id}`}
                                        className={styles.button}
                                    >
                                        Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default OrderListScreen;
