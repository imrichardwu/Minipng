import { Link } from 'react-router-dom';
import Rating from './Rating';
import styles from './Product.module.css';

const Product = ({ product }) => {
  return (
    <div className={styles.card}>
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          className={styles.cardImg}
          alt={product.name}
        />
      </Link>

      <div className={styles.cardBody}>
        <Link to={`/product/${product._id}`}>
          <div className={styles.productTitle}>
            <strong>{product.name}</strong>
          </div>
        </Link>

        <div className={styles.rating}>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </div>

        <div className={styles.price}>${product.price}</div>
      </div>
    </div>
  );
};

export default Product;
