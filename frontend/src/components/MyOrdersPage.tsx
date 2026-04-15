import { useEffect, useState } from 'react';
import { fetchMyOrders } from '../services/ordersApi';
import type { Order } from '../types/order';
import styles from './MyOrdersPage.module.css';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchMyOrders();
        setOrders(result);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load order history.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrders();
  }, []);

  if (isLoading) {
    return (
      <section className={styles.page} aria-label="My orders page">
        <h2 className={styles.heading}>My Orders</h2>
        <p className={styles.message}>Loading your order history...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.page} aria-label="My orders page">
        <h2 className={styles.heading}>My Orders</h2>
        <p className={styles.error} role="alert">{error}</p>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className={styles.page} aria-label="My orders page">
        <h2 className={styles.heading}>My Orders</h2>
        <p className={styles.message}>You have not placed any orders yet.</p>
      </section>
    );
  }

  return (
    <section className={styles.page} aria-label="My orders page">
      <h2 className={styles.heading}>My Orders</h2>

      {orders.map((order) => (
        <article key={order.id} className={styles.card}>
          <p className={styles.confirmation}>Confirmation: {order.confirmationNumber}</p>
          <p className={styles.status}>Status: {order.status}</p>
          <p className={styles.meta}>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
          <p className={styles.meta}>Shipping: {order.shippingAddress}</p>

          <ul className={styles.summaryList}>
            {order.items.map((item) => (
              <li key={`${order.id}-${item.productId}-${item.productTitle}`} className={styles.summaryItem}>
                <span>{item.productTitle} x {item.quantity}</span>
                <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <p className={styles.total}>Total: ${order.total.toFixed(2)}</p>
        </article>
      ))}
    </section>
  );
}
