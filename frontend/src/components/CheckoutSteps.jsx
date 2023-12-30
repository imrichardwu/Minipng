import {Link} from "react-router-dom";
import styles from "./CheckoutSteps.module.css";

function CheckoutSteps({step1, step2, step3, step4}) {
    return (
        <nav className={styles.nav}>
            <li className={styles.navItem}>
                {step1 ? (
                    <Link to="/login" className={styles.navLink}>
                        Sign In
                    </Link>
                ) : (
                    <span className={styles.navLinkDisabled}>Sign In</span>
                )}
            </li>

            <li className={styles.navItem}>
                {step2 ? (
                    <Link to="/shipping" className={styles.navLink}>
                        Shipping
                    </Link>
                ) : (
                    <span className={styles.navLinkDisabled}>Shipping</span>
                )}
            </li>

            <li className={styles.navItem}>
                {step3 ? (
                    <Link to="/payment" className={styles.navLink}>
                        Payment
                    </Link>
                ) : (
                    <span className={styles.navLinkDisabled}>Payment</span>
                )}
            </li>

            <li className={styles.navItem}>
                {step4 ? (
                    <Link to="/placeorder" className={styles.navLink}>
                        Place Order
                    </Link>
                ) : (
                    <span className={styles.navLinkDisabled}>Place Order</span>
                )}
            </li>
        </nav>
    );
}

export default CheckoutSteps;
