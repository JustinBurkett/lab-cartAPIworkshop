import { useEffect, useMemo, useState } from 'react';
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminOrders,
  fetchAdminProducts,
  updateAdminProduct,
  updateOrderStatus,
} from '../services/adminApi';
import type { AdminOrder, AdminProduct, UpsertProductRequest } from '../types/admin';
import styles from './AdminDashboard.module.css';

const ORDER_STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;

interface ProductFormState {
  title: string;
  description: string;
  price: string;
  stockQuantity: string;
  category: string;
  sellerName: string;
  imageUrl: string;
}

const EMPTY_PRODUCT_FORM: ProductFormState = {
  title: '',
  description: '',
  price: '',
  stockQuantity: '',
  category: '',
  sellerName: '',
  imageUrl: '',
};

function toPayload(form: ProductFormState): UpsertProductRequest {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    stockQuantity: Number(form.stockQuantity),
    category: form.category.trim(),
    sellerName: form.sellerName.trim(),
    imageUrl: form.imageUrl.trim(),
  };
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_PRODUCT_FORM);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [productData, orderData] = await Promise.all([
        fetchAdminProducts(),
        fetchAdminOrders(),
      ]);

      setProducts(productData);
      setOrders(orderData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function onFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function beginEdit(product: AdminProduct) {
    setEditingProductId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      category: product.category,
      sellerName: product.sellerName,
      imageUrl: product.imageUrl,
    });
  }

  function resetForm() {
    setEditingProductId(null);
    setForm(EMPTY_PRODUCT_FORM);
  }

  async function onSubmitProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload = toPayload(form);

      if (editingProductId === null) {
        await createAdminProduct(payload);
        setSuccess('Product added successfully.');
      } else {
        await updateAdminProduct(editingProductId, payload);
        setSuccess('Product updated successfully.');
      }

      resetForm();
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save product.');
    }
  }

  async function onDeleteProduct(productId: number) {
    setError(null);
    setSuccess(null);

    try {
      await deleteAdminProduct(productId);
      setSuccess('Product deleted successfully.');
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete product.');
    }
  }

  async function onStatusChange(orderId: number, status: string) {
    setError(null);
    setSuccess(null);

    try {
      const updatedOrder = await updateOrderStatus(orderId, { status });
      setOrders((prev) => prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
      setSuccess(`Order ${updatedOrder.confirmationNumber} updated to ${updatedOrder.status}.`);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Unable to update order status.');
    }
  }

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.title.localeCompare(b.title)),
    [products],
  );

  if (loading) {
    return <section className={styles.page}><h2 className={styles.heading}>Loading admin dashboard...</h2></section>;
  }

  return (
    <section className={styles.page} aria-label="Admin dashboard">
      <h2 className={styles.heading}>Admin Dashboard</h2>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {success && <p className={styles.success} role="status">{success}</p>}

      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>Product Management</h3>
        <form onSubmit={onSubmitProduct} aria-label="Product management form">
          <div className={styles.formGrid}>
            <input className={styles.input} aria-label="Product title" name="title" value={form.title} onChange={onFormChange} placeholder="Title" required />
            <input className={styles.input} aria-label="Category" name="category" value={form.category} onChange={onFormChange} placeholder="Category" required />
            <input className={styles.input} aria-label="Price" name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={onFormChange} placeholder="Price" required />
            <input className={styles.input} aria-label="Stock quantity" name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={onFormChange} placeholder="Stock quantity" required />
            <input className={styles.input} aria-label="Seller name" name="sellerName" value={form.sellerName} onChange={onFormChange} placeholder="Seller name" required />
            <input className={styles.input} aria-label="Image URL" name="imageUrl" value={form.imageUrl} onChange={onFormChange} placeholder="Image URL" required />
          </div>
          <textarea className={styles.textarea} aria-label="Description" name="description" value={form.description} onChange={onFormChange} placeholder="Description" required />

          <div className={styles.actions}>
            <button className={styles.primaryButton} type="submit" aria-label={editingProductId === null ? 'Add product' : 'Update product'}>
              {editingProductId === null ? 'Add Product' : 'Update Product'}
            </button>
            {editingProductId !== null && (
              <button className={styles.secondaryButton} type="button" onClick={resetForm} aria-label="Cancel editing">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stockQuantity}</td>
                  <td>
                    <div className={styles.productActions}>
                      <button className={styles.secondaryButton} type="button" onClick={() => beginEdit(product)} aria-label={`Edit ${product.title}`}>
                        Edit
                      </button>
                      <button className={styles.dangerButton} type="button" onClick={() => void onDeleteProduct(product.id)} aria-label={`Delete ${product.title}`}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>All Orders</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Confirmation</th>
                <th>User</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.confirmationNumber}</td>
                  <td>{order.userId}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <div className={styles.inlineRow}>
                      <select
                        className={styles.select}
                        aria-label={`Order status for ${order.confirmationNumber}`}
                        value={order.status}
                        onChange={(event) => {
                          void onStatusChange(order.id, event.target.value);
                        }}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
