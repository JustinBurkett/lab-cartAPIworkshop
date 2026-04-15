import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { state, cartTotal, updateQuantity, removeFromCart } = useCartContext();
  const { items, isLoading, error } = state;
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <h2 className={styles.heading}>Loading your cart...</h2>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <Link to="/" className={styles.backLink} aria-label="Back to products">
          ← Back to Products
        </Link>
        <h2 className={styles.heading}>Your Cart</h2>
        <div className={styles.empty}>
          <p className={styles.emptyText}>Your cart is empty.</p>
          <Link to="/" className={styles.browseLink}>
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink} aria-label="Back to products">
        ← Back to Products
      </Link>
      {statusMessage && (
        <p role="status" className={styles.statusMessage}>
          {statusMessage}
        </p>
      )}
      {error && (
        <p role="alert" className={styles.emptyText}>
          {error}
        </p>
      )}
      <ul className={styles.itemList}>
        {items.map((item) => (
          <CartItemRow
            key={item.cartItemId}
            item={item}
            onDecrement={async (currentItem) => {
              const next = Math.max(1, currentItem.quantity - 1);
              await updateQuantity(currentItem, next);
            }}
            onIncrement={async (currentItem) => {
              const next = Math.min(99, currentItem.quantity + 1);
              await updateQuantity(currentItem, next);
            }}
            onRemove={async (currentItem) => {
              await removeFromCart(currentItem);
              setStatusMessage(`${currentItem.productName} removed from cart.`);
              setTimeout(() => setStatusMessage(null), 1500);
            }}
          />
        ))}
      </ul>

      <CartSummary total={cartTotal} />
      <Link to="/checkout" className={styles.checkoutButton} aria-label="Proceed to checkout">
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default CartPage;
