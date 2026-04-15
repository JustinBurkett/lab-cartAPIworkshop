import { expect, test } from '@playwright/test';

test('happy path register to order history', async ({ page }) => {
  const uniqueEmail = `e2e-${Date.now()}@example.com`;
  const password = 'Password1';

  await page.goto('/register');

  await page.getByLabel('Email').fill(uniqueEmail);
  await page.locator('#register-password').fill(password);
  await page.getByLabel('Confirm password').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL('/');

  await page.getByRole('button', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL('/');

  await page.getByRole('button', { name: /add .* to cart/i }).first().click();
  await page.getByLabel(/shopping cart with/i).click();

  await expect(page).toHaveURL('/cart');
  await page.getByRole('link', { name: 'Proceed to Checkout' }).click();

  await expect(page).toHaveURL('/checkout');

  await page.getByLabel('Full Name').fill('Buckeye Student');
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Shipping Address').fill('123 Lane Ave');
  await page.getByLabel('City').fill('Columbus');
  await page.getByLabel('State').selectOption('OH');
  await page.getByLabel('Zip Code').fill('43210');
  await page.getByRole('button', { name: 'Place your order' }).click();

  await expect(page).toHaveURL('/orders/confirmation');
  await expect(page.getByRole('heading', { name: 'Order Placed Successfully' })).toBeVisible();

  const confirmationText = await page.locator('p').filter({ hasText: 'Confirmation Number:' }).innerText();
  const confirmationNumber = confirmationText.replace('Confirmation Number:', '').trim();

  await page.getByRole('link', { name: 'My Orders' }).click();

  await expect(page).toHaveURL('/orders/mine');
  await expect(page.getByRole('heading', { name: 'My Orders' })).toBeVisible();
  await expect(page.getByText(confirmationNumber)).toBeVisible();
});
