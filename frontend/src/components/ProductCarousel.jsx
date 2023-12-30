import { Link } from 'react-router-dom';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import styles from './ProductCarousel.module.css'; // Import your CSS modules
import { useSwipeable } from 'react-swipeable';
import { useEffect, useState } from 'react';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <Message variant='danger'>{error?.data?.message || error.error}</Message>
    );
  }

  const carouselItems = products.map((product) => ({
    image: (
      <img
        src={product.image}
        alt={product.name}
        className={styles.carouselImage}
      />
    ),
    caption: (
      <div className={styles.caption}>
        <h2 className={`${styles.textBlack} `}>
          {product.name} (${product.price})
        </h2>
      </div>
    ),
  }));

  return <CustomCarousel items={carouselItems} />;
};

function CarouselItem({ children, width, active, caption }) {
  const [loading, setLoading] = useState(true);
  const imgSrc = children.props.src; // Extract the src from the children prop

  useEffect(() => {
    const img = new Image();
    img.src = imgSrc; // Use the extracted src
    img.onload = () => setLoading(false);
  }, [imgSrc]); // Depend on the extracted src

  return (
    <div
      className={`${styles.carouselItem} ${active ? styles.active : ''}`}
      style={{
        width: width,
        position: 'relative',
        paddingBottom: '1em',
        overflow: 'hidden',
      }} // Add overflow: hidden to the carousel item
    >
      {loading ? (
        <div className={styles.loader}></div> /* Your loader here */
      ) : (
        <div style={{ height: '100%' }}>
          <img
            src={imgSrc} // Use the extracted src
            className={styles.carouselImage}
            alt='Carousel Item'
            style={{ width: '100%', objectFit: 'contain' }} // Display the full image without cutting off any part
          />
          <div
            className={styles.caption}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0, // Position the caption at the very left of the carousel item
              width: '100%',
              textAlign: 'left',
            }}
          >
            {caption}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const handlers = useSwipeable({
    onSwipedLeft: () => updateIndex(activeIndex + 1),
    onSwipedRight: () => updateIndex(activeIndex - 1),
  });

  function updateIndex(index) {
    if (index < 0) {
      setActiveIndex(items.length - 1);
    } else if (index >= items.length) {
      setActiveIndex(0);
    } else {
      setActiveIndex(index);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex, paused]);

  return (
    <div
      {...handlers}
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        className={`${styles.carouselButton} ${styles.previous}`}
        onClick={() => {
          updateIndex(activeIndex - 1);
        }}
      >
        &#60;
      </button>

      <div
        className={styles.inner}
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            width='100%'
            active={index === activeIndex}
            caption={item.caption}
          >
            {item.image}
          </CarouselItem>
        ))}
      </div>

      <button
        className={`${styles.carouselButton} ${styles.next}`}
        onClick={() => {
          updateIndex(activeIndex + 1);
        }}
      >
        &#62;
      </button>

      <div className={styles.indicators}>
        {items.map((_, index) => (
          <button
            key={index}
            className={`${index === activeIndex ? styles.active : ''} `}
            onClick={() => {
              updateIndex(index);
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default ProductCarousel;
