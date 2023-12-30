import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {useRegisterMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import {toast} from "react-toastify";
import styles from "./RegisterScreen.module.css";

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, {isLoading}] = useRegisterMutation();

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

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
        } else {
            try {
                const res = await register({name, email, password}).unwrap();
                dispatch(setCredentials({...res}));
                navigate(redirect);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <FormContainer>
            <h1>Register</h1>
            <form onSubmit={submitHandler}>
                <div className={styles.formGroup} id="name">
                    <label>Name</label>
                    <input
                        className={styles.formControl}
                        type="name"
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

                <button
                    disabled={isLoading}
                    className={styles.button}
                    type="submit"
                >
                    Register
                </button>

                {isLoading && <Loader />}
            </form>

            <div className={styles.row}>
                Already have an account?{" "}
                <Link
                    to={redirect ? `/login?redirect=${redirect}` : "/login"}
                    className={styles.link}
                >
                    Login
                </Link>
            </div>
        </FormContainer>
    );
};

export default RegisterScreen;
