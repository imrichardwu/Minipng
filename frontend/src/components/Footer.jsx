import styles from "./Footer.module.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <div className={styles.container}>
                <div className={styles.row}>
                    <div
                        className={`${styles.col} ${styles.textCenter} ${styles.py3}`}
                    >
                        <p>Miniping &copy; {currentYear}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
