## 2024-07-22 - Handling Loading States for Synchronous Redirects

**Learning:** When a user action, like an OAuth login, triggers a synchronous, full-page redirect (`window.location.href`), the browser navigates away immediately. This prevents React's state updates from re-rendering the component, meaning UI feedback like spinners or disabled states won't be displayed.

**Action:** To ensure the UI has a chance to update, wrap the navigation call in a `setTimeout` with a zero-millisecond delay (`setTimeout(..., 0)`). This pushes the navigation to the end of the event loop, giving React just enough time to re-render the component with the loading state before the page redirects.
