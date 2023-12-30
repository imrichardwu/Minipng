import { Link } from 'react-router-dom';
import styles from './Paginate.module.css';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <ul className={styles.pagination}>
        {[...Array(pages).keys()].map((x) => (
          <li key={x + 1} className={x + 1 === page ? styles.active : ''}>
            <Link
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `/admin/productlist/${x + 1}`
              }
            >
              {x + 1}
            </Link>
          </li>
        ))}
      </ul>
    )
  );
};

export default Paginate;
