import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import {saveShippingAddress} from "../slices/cartSlice";
import styles from "./ShippingScreen.module.css";

function ShippingScreen() {
    const cart = useSelector((state) => state.cart);
    const {shippingAddress} = cart;

    const [address, setAddress] = useState(shippingAddress.address || "");
    const [city, setCity] = useState(shippingAddress.city || "");
    const [postalCode, setPostalCode] = useState(
        shippingAddress.postalCode || ""
    );
    const [country, setCountry] = useState(shippingAddress.country || "");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, city, postalCode, country}));
        navigate("/payment");
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping</h1>
            <form onSubmit={submitHandler}>
                <div className={styles.formGroup} id="address">
                    <label>Address</label>
                    <input
                        className={styles.formControl}
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup} id="city">
                    <label>City</label>
                    <input
                        className={styles.formControl}
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup} id="postalCode">
                    <label>Postal Code</label>
                    <input
                        className={styles.formControl}
                        type="text"
                        placeholder="Enter postal code"
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup} id="country">
                    <label>Country</label>
                    <input
                        className={styles.formControl}
                        type="text"
                        placeholder="Enter country"
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>

                <button className={styles.button} type="submit">
                    Continue
                </button>
            </form>
        </FormContainer>
    );
}

export default ShippingScreen;
