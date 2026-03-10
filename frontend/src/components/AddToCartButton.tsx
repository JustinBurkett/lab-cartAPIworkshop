import { useState } from 'react';
import { useCartContext } from '../contexts/CartContext';
import styles from './AddToCartButton.module.css';

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCartContext();
  const [added, setAdded] = useState(false);

  function handleClick() {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      aria-label={`Add ${product.name} to cart`}
    >
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
