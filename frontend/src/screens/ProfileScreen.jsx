import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {FaTimes} from "react-icons/fa";
import {toast} from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {useProfileMutation} from "../slices/usersApiSlice";
import {useGetMyOrdersQuery} from "../slices/ordersApiSlice";
import {setCredentials} from "../slices/authSlice";
import styles from "./ProfileScreen.module.css";
import {Link} from "react-router-dom";

const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {userInfo} = useSelector((state) => state.auth);

    const {data: orders, isLoading, error} = useGetMyOrdersQuery();

    const [updateProfile, {isLoading: loadingUpdateProfile}] =
        useProfileMutation();

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
    }, [userInfo.email, userInfo.name]);

    const dispatch = useDispatch();
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
        } else {
            try {
                const res = await updateProfile({
                    name,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials({...res}));
                toast.success("Profile updated successfully");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.colMd3}>
                <h2>User Profile</h2>

                <form onSubmit={submitHandler}>
                    <div className={styles.formGroup} id="name">
                        <label>Name</label>
                        <input
                            className={styles.formControl}
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup} id="email">
                        <label>Email Address</label>
                        <input
                            className={styles.formControl}
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup} id="password">
                        <label>Password</label>
                        <input
                            className={styles.formControl}
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup} id="confirmPassword">
                        <label>Confirm Password</label>
                        <input
                            className={styles.formControl}
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button className={styles.button} type="submit">
                        Update
                    </button>
                    {loadingUpdateProfile && <Loader />}
                </form>
            </div>
            <div className={styles.colMd9}>
                <h2>My Orders</h2>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <table className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <FaTimes style={{color: "red"}} />
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <FaTimes style={{color: "red"}} />
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/order/${order._id}`}>
                                            <button className={styles.button}>
                                                Details
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProfileScreen;
