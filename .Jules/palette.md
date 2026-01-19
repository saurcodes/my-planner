## 2024-07-25 - Forcing UI Updates Before Redirects
**Learning:** When an action causes a synchronous, full-page redirect (like an OAuth login), React may not re-render the component to show a loading state before the browser navigates away. The redirect interrupts the render cycle.
**Action:** Wrap the navigation call (e.g., `window.location.href = ...`) in a `setTimeout(..., 0)`. This defers the navigation to the end of the event loop, giving React the necessary time to commit the state update and render the loading indicator to the DOM, providing crucial user feedback.

## 2024-07-25 - Reliably Verifying Pre-Redirect UI States
**Learning:** Playwright tests for UI states that appear just before a redirect are inherently flaky. The test can fail because the navigation happens before assertions can complete. Furthermore, the current test environment often produces blank screenshots, making visual verification unreliable.
**Action:** To create a stable test, use `page.route()` to intercept and `abort()` the navigation request. This freezes the application in the pre-redirect state. Then, rely on Playwright's locators and web-first assertions (`expect(locator).toBeDisabled()`, `expect(spinner).toBeVisible()`) to confirm the UI is correct, rather than relying solely on the unreliable screenshots.
