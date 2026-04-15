import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { placeOrder } from '../services/ordersApi';
import type { Order } from '../types/order';
import styles from './CheckoutForm.module.css';

interface FormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

type FieldName = keyof FormData;

const US_STATES: { value: string; label: string }[] = [
  { value: 'CA', label: 'CA' },
  { value: 'FL', label: 'FL' },
  { value: 'NY', label: 'NY' },
  { value: 'OH', label: 'OH' },
  { value: 'TX', label: 'TX' },
];

const ALL_FIELDS: FieldName[] = ['fullName', 'email', 'address', 'city', 'state', 'zipCode'];

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }
  if (!data.email.includes('@')) {
    errors.email = 'Email must contain @.';
  }
  if (data.address.trim().length < 5) {
    errors.address = 'Shipping address must be at least 5 characters.';
  }
  if (data.city.trim().length === 0) {
    errors.city = 'City is required.';
  }
  if (data.state === '') {
    errors.state = 'Please select a state.';
  }
  if (!/^\d{5}$/.test(data.zipCode)) {
    errors.zipCode = 'Zip code must be exactly 5 digits.';
  }

  return errors;
}

interface CheckoutFormProps {
  onOrderPlaced: (order: Order) => void;
}

export function CheckoutForm({ onOrderPlaced }: CheckoutFormProps) {
  const { cartItemCount, cartTotal, state, refreshCart } = useCartContext();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setTouched(prev => new Set(prev).add(name));
    // Use e.target.value directly so validation reflects the field's latest value
    // even if the formData state update from onChange hasn't flushed yet
    setErrors(validate({ ...formData, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const allErrors = validate(formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setTouched(new Set(ALL_FIELDS));
      return;
    }

    setSubmitError(null);
    setIsProcessing(true);

    try {
      const shippingAddress = `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state} ${formData.zipCode}`;
      const order = await placeOrder({ shippingAddress });
      await refreshCart(false);
      onOrderPlaced(order);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to place order.');
    } finally {
      setIsProcessing(false);
    }
  }

  const hasError = (field: FieldName): boolean => touched.has(field) && !!errors[field];

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Checkout</h2>
      <div className={styles.layout}>
        <form
          onSubmit={handleSubmit}
          noValidate
          className={styles.form}
          aria-label="Checkout form"
        >
          {/* Full Name */}
          <div className={styles.field}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={`${styles.input}${hasError('fullName') ? ` ${styles.inputError}` : ''}`}
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-required="true"
              aria-invalid={hasError('fullName') || undefined}
              aria-describedby={hasError('fullName') ? 'fullName-error' : undefined}
              autoComplete="name"
            />
            {hasError('fullName') && (
              <span id="fullName-error" className={styles.errorMsg} role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`${styles.input}${hasError('email') ? ` ${styles.inputError}` : ''}`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-required="true"
              aria-invalid={hasError('email') || undefined}
              aria-describedby={hasError('email') ? 'email-error' : undefined}
              autoComplete="email"
            />
            {hasError('email') && (
              <span id="email-error" className={styles.errorMsg} role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Shipping Address */}
          <div className={styles.field}>
            <label htmlFor="address" className={styles.label}>
              Shipping Address <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className={`${styles.input}${hasError('address') ? ` ${styles.inputError}` : ''}`}
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-required="true"
              aria-invalid={hasError('address') || undefined}
              aria-describedby={hasError('address') ? 'address-error' : undefined}
              autoComplete="street-address"
            />
            {hasError('address') && (
              <span id="address-error" className={styles.errorMsg} role="alert">
                {errors.address}
              </span>
            )}
          </div>

          {/* City / State / Zip row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="city" className={styles.label}>
                City <span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className={`${styles.input}${hasError('city') ? ` ${styles.inputError}` : ''}`}
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-invalid={hasError('city') || undefined}
                aria-describedby={hasError('city') ? 'city-error' : undefined}
                autoComplete="address-level2"
              />
              {hasError('city') && (
                <span id="city-error" className={styles.errorMsg} role="alert">
                  {errors.city}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="state" className={styles.label}>
                State <span className={styles.required} aria-hidden="true">*</span>
              </label>
              <select
                id="state"
                name="state"
                className={`${styles.select}${hasError('state') ? ` ${styles.inputError}` : ''}`}
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-invalid={hasError('state') || undefined}
                aria-describedby={hasError('state') ? 'state-error' : undefined}
                autoComplete="address-level1"
              >
                <option value="">Select a state</option>
                {US_STATES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {hasError('state') && (
                <span id="state-error" className={styles.errorMsg} role="alert">
                  {errors.state}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="zipCode" className={styles.label}>
                Zip Code <span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                inputMode="numeric"
                maxLength={5}
                className={`${styles.input}${hasError('zipCode') ? ` ${styles.inputError}` : ''}`}
                value={formData.zipCode}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-invalid={hasError('zipCode') || undefined}
                aria-describedby={hasError('zipCode') ? 'zipCode-error' : undefined}
                autoComplete="postal-code"
              />
              {hasError('zipCode') && (
                <span id="zipCode-error" className={styles.errorMsg} role="alert">
                  {errors.zipCode}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={cartItemCount === 0 || isProcessing}
            aria-label={isProcessing ? 'Processing your order' : 'Place your order'}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>

          {submitError && (
            <p className={styles.errorMsg} role="alert">
              {submitError}
            </p>
          )}

          {cartItemCount === 0 && (
            <p className={styles.emptyCartNote} role="status">
              Your cart is empty.{' '}
              <Link to="/" aria-label="Browse products to add to cart">
                Add items
              </Link>{' '}
              before placing an order.
            </p>
          )}
        </form>

        <aside className={styles.summary} aria-label="Order summary">
          <h3 className={styles.summaryHeading}>Order Summary</h3>
          <div className={styles.summaryLine}>
            <span>Items</span>
            <span>{cartItemCount}</span>
          </div>
          {state.items.map((item) => (
            <div key={item.cartItemId} className={styles.summaryLine}>
              <span>{item.productName} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className={`${styles.summaryLine} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
