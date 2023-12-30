import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

import {useLoginMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import {toast} from "react-toastify";

import styles from "./LoginScreen.module.css"; // Import your CSS module
function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, {isLoading}] = useLoginMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({email, password}).unwrap();
            dispatch(setCredentials({...res}));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <FormContainer>
            <h1>Sign In</h1>

            <form onSubmit={submitHandler} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.formControl}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.formControl}
                    />
                </div>

                <button
                    disabled={isLoading}
                    type="submit"
                    className={styles.btnPrimary}
                >
                    Sign In
                </button>

                {isLoading && <Loader />}
            </form>

            <div className={styles.row}>
                New Customer?{" "}
                <Link
                    to={
                        redirect
                            ? `/register?redirect=${redirect}`
                            : "/register"
                    }
                >
                    Register
                </Link>
            </div>
        </FormContainer>
    );
}

export default LoginScreen;
