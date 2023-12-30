import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Form, Button} from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import {
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import styles from "./UserEditScreen.module.css";

const UserEditScreen = () => {
    const {id: userId} = useParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const {
        data: user,
        isLoading,
        error,
        refetch,
    } = useGetUserDetailsQuery(userId);

    const [updateUser, {isLoading: loadingUpdate}] = useUpdateUserMutation();

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateUser({userId, name, email, isAdmin});
            toast.success("user updated successfully");
            refetch();
            navigate("/admin/userlist");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user]);

    return (
        <>
            <Link to="/admin/userlist" className={styles.button}>
                Go Back
            </Link>
            <div className={styles.container}>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className={styles.group}>
                            <label>Name</label>
                            <input
                                type="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.control}
                            />
                        </div>

                        <div className={styles.group}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.control}
                            />
                        </div>

                        <div className={styles.group}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isAdmin}
                                    onChange={(e) =>
                                        setIsAdmin(e.target.checked)
                                    }
                                />
                                Is Admin
                            </label>
                        </div>

                        <button type="submit" className={styles.button}>
                            Update
                        </button>
                    </form>
                )}
            </div>
        </>
    );
};

export default UserEditScreen;
