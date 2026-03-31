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
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled = false }: AddToCartButtonProps) {
  const { addToCart } = useCartContext();
  const [added, setAdded] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleClick() {
    if (disabled) {
      return;
    }

    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
      setFailed(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      setFailed(true);
      setAdded(false);
    }
  }

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Add ${product.name} to cart`}
    >
      {disabled ? 'Out of Stock' : added ? 'Added!' : failed ? 'Try Again' : 'Add to Cart'}
    </button>
  );
}
