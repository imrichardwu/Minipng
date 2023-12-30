import {Link} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useLogoutMutation} from "../slices/usersApiSlice";
import {logout} from "../slices/authSlice";
import SearchBox from "./SearchBox";
import logo from "../assets/logo.png";
import {resetCart} from "../slices/cartSlice";
import styles from "./Header.module.css";

function Header() {
    const {cartItems} = useSelector((state) => state.cart);
    const {userInfo} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            dispatch(resetCart());
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.navbar}>
                <Link to="/" className={styles.brand}>
                    <img src={logo} alt="Miniping" className={styles.logo} />
                    Miniping
                </Link>
                <div className={styles.nav}>
                    <SearchBox />
                    <Link to="/cart" className={styles.navLink}>
                        Cart
                        {cartItems.length > 0 && (
                            <span className={styles.badge}>
                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        )}
                    </Link>
                    {userInfo ? (
                        <div className={styles.dropdown}>
                            <button className={styles.dropdownButton}>
                                {userInfo.name}
                            </button>
                            <div className={styles.dropdownContent}>
                                <Link
                                    to="/profile"
                                    className={styles.dropdownItem}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={logoutHandler}
                                    className={styles.dropdownItem}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className={styles.navLink}>
                            Sign In
                        </Link>
                    )}

                    {userInfo && userInfo.isAdmin && (
                        <div className={styles.dropdown}>
                            <button className={styles.dropdownButton}>
                                Admin
                            </button>
                            <div className={styles.dropdownContent}>
                                <Link
                                    to="/admin/productlist"
                                    className={styles.dropdownItem}
                                >
                                    Products
                                </Link>
                                <Link
                                    to="/admin/orderlist"
                                    className={styles.dropdownItem}
                                >
                                    Orders
                                </Link>
                                <Link
                                    to="/admin/userlist"
                                    className={styles.dropdownItem}
                                >
                                    Users
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
