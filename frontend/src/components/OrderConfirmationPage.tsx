import { Link, Navigate, useLocation } from 'react-router-dom';
import type { Order } from '../types/order';
import styles from './OrderConfirmationPage.module.css';

interface OrderConfirmationLocationState {
  order?: Order;
}

export default function OrderConfirmationPage() {
  const location = useLocation();
  const locationState = location.state as OrderConfirmationLocationState | undefined;
  const order = locationState?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className={styles.page} aria-label="Order confirmation page">
      <div className={styles.card}>
        <h2 className={styles.heading}>Order Placed Successfully</h2>
        <p className={styles.confirmation}>Confirmation Number: {order.confirmationNumber}</p>
        <p className={styles.meta}>Status: {order.status}</p>
        <p className={styles.meta}>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
        <p className={styles.meta}>Shipping Address: {order.shippingAddress}</p>

        <h3 className={styles.sectionTitle}>Order Summary</h3>
        <ul className={styles.list}>
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.productTitle}`} className={styles.item}>
              <span>
                {item.productTitle} x {item.quantity}
              </span>
              <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <p className={styles.total}>Total: ${order.total.toFixed(2)}</p>

        <div className={styles.actions}>
          <Link to="/" className={styles.linkButton} aria-label="Continue shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
