import type { CartItem } from '../types/cart';
import styles from './CartPage.module.css';

interface CartItemRowProps {
  item: CartItem;
  onDecrement: (item: CartItem) => Promise<void>;
  onIncrement: (item: CartItem) => Promise<void>;
  onRemove: (item: CartItem) => Promise<void>;
}

export function CartItemRow({ item, onDecrement, onIncrement, onRemove }: CartItemRowProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <li className={styles.item}>
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
          onClick={() => void onDecrement(item)}
          disabled={item.quantity === 1}
          aria-label={`Decrease quantity of ${item.productName}`}
        >
          -
        </button>
        <span className={styles.quantity} aria-label={`Quantity: ${item.quantity}`}>
          {item.quantity}
        </span>
        <button
          type="button"
          className={styles.qtyButton}
          onClick={() => void onIncrement(item)}
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
        onClick={() => void onRemove(item)}
        aria-label={`Remove ${item.productName} from cart`}
      >
        Remove
      </button>
    </li>
  );
}
