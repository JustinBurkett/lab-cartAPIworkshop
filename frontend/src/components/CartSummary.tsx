import styles from './CartPage.module.css';

interface CartSummaryProps {
  total: number;
}

export function CartSummary({ total }: CartSummaryProps) {
  return (
    <div className={styles.footer}>
      <p className={styles.total}>
        Total: <span className={styles.totalAmount}>${total.toFixed(2)}</span>
      </p>
    </div>
  );
}
