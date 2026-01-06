import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should show loading state on Google login click', async ({ page }) => {
    // Intercept the navigation to prevent the actual redirect
    await page.route('/api/auth/google', route => {
      // Abort the request to keep the page from unloading
      route.abort();
    });

    await page.goto('/login');

    // Wait for the button to be visible and enabled
    const loginButton = page.getByRole('button', { name: 'Continue with Google' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    // Click the button to trigger the loading state
    await loginButton.click();

    // The button should now be disabled and show the loading text
    const loadingButton = page.getByRole('button', { name: 'Continuing...' });
    await expect(loadingButton).toBeVisible();
    await expect(loadingButton).toBeDisabled();

    // Take a screenshot to visually verify the loading state
    await expect(page).toHaveScreenshot('login-loading-state.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow for minor rendering differences
    });
  });
});
