import styles from "./Message.module.css"; // Import the CSS module

function Message({variant, children}) {
    return <div className={styles[variant]}>{children}</div>;
}

Message.defaultProps = {
    variant: "info",
};

export default Message;
