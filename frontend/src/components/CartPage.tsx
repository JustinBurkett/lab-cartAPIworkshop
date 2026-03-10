import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { CheckoutForm } from './CheckoutForm';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { state, dispatch, cartTotal } = useCartContext();
  const { items } = state;
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (orderPlaced) {
    return (
      <div className={styles.page}>
        <div className={styles.success} role="status" aria-live="polite">
          <h2 className={styles.successHeading}>Order Placed!</h2>
          <p className={styles.successText}>
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <Link to="/" className={styles.continueLink}>
            Continue Shopping
          </Link>
        </div>
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
      <ul className={styles.itemList}>
        {items.map((item) => {
          const lineTotal = item.price * item.quantity;

          function handleDecrement() {
            const next = Math.max(1, item.quantity - 1);
            dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.productId, quantity: next } });
          }

          function handleIncrement() {
            const next = Math.min(99, item.quantity + 1);
            dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.productId, quantity: next } });
          }

          function handleRemove() {
            dispatch({ type: 'REMOVE_FROM_CART', payload: { productId: item.productId } });
          }

          return (
            <li key={item.productId} className={styles.item}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.productName} className={styles.image} />
              ) : (
                <div className={styles.imagePlaceholder} aria-hidden="true" />
              )}

              <div className={styles.info}>
                <p className={styles.name}>{item.productName}</p>
                <p className={styles.price}>${item.price.toFixed(2)} each</p>
              </div>

              <div className={styles.quantityControl}>
                <button
                  type="button"
                  className={styles.qtyButton}
                  onClick={handleDecrement}
                  disabled={item.quantity === 1}
                  aria-label={`Decrease quantity of ${item.productName}`}
                >
                  −
                </button>
                <span className={styles.quantity} aria-label={`Quantity: ${item.quantity}`}>
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className={styles.qtyButton}
                  onClick={handleIncrement}
                  disabled={item.quantity === 99}
                  aria-label={`Increase quantity of ${item.productName}`}
                >
                  +
                </button>
              </div>

              <span className={styles.lineTotal}>${lineTotal.toFixed(2)}</span>

              <button
                type="button"
                className={styles.removeButton}
                onClick={handleRemove}
                aria-label={`Remove ${item.productName} from cart`}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.footer}>
        <p className={styles.total}>
          Total: <span className={styles.totalAmount}>${cartTotal.toFixed(2)}</span>
        </p>
      </div>

      {state.items.length > 0 && <CheckoutForm onOrderPlaced={() => setOrderPlaced(true)} />}
    </div>
  );
};

export default CartPage;
