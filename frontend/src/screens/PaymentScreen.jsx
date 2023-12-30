import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import {savePaymentMethod} from "../slices/cartSlice";
import styles from "./PaymentScreen.module.css";

function PaymentScreen() {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const {shippingAddress} = cart;

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate("/shipping");
        }
    }, [navigate, shippingAddress]);

    const [paymentMethod, setPaymentMethod] = useState("PayPal");

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate("/placeorder");
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <form onSubmit={submitHandler}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Select Method</label>
                    <div className={styles.radioWrapper}>
                        <input
                            className={styles.radioInput}
                            type="radio"
                            id="PayPal"
                            name="paymentMethod"
                            value="PayPal"
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="PayPal">PayPal or Credit Card</label>
                    </div>
                </div>

                <button className={styles.submitButton} type="submit">
                    Continue
                </button>
            </form>
        </FormContainer>
    );
}

export default PaymentScreen;
