## 2024-07-22 - Handling Loading States for Synchronous Redirects

**Learning:** When a user action, like an OAuth login, triggers a synchronous, full-page redirect (`window.location.href`), the browser navigates away immediately. This prevents React's state updates from re-rendering the component, meaning UI feedback like spinners or disabled states won't be displayed.

**Action:** To ensure the UI has a chance to update, wrap the navigation call in a `setTimeout` with a zero-millisecond delay (`setTimeout(..., 0)`). This pushes the navigation to the end of the event loop, giving React just enough time to re-render the component with the loading state before the page redirects.

## 2024-07-23 - Disabled States for Async Buttons

**Learning:** A core UX principle for this project is to disable buttons during asynchronous operations (e.g., API calls, form submissions) to prevent multiple submissions and provide clear visual feedback to the user.

**Action:** When a button triggers an async action, set its `disabled` attribute to a loading state variable. Use Tailwind's `disabled:` utility variants (e.g., `disabled:opacity-75`, `disabled:cursor-not-allowed`) for styling, ensuring a consistent look and feel across the application.
