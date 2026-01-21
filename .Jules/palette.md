## 2024-07-25 - Handling UI updates on synchronous redirects

**Learning:** When a user action, like an OAuth login, triggers an immediate, synchronous full-page redirect, React may not have enough time to re-render the component and show a loading or pending state. This can make the UI feel unresponsive, as the user clicks a button and nothing appears to happen before the page changes.

**Action:** To ensure the UI updates, wrap the redirect logic in a `setTimeout` with a `0` millisecond delay. This pushes the navigation to the back of the event queue, giving React the necessary time to commit the state change (e.g., `isRedirecting = true`) and re-render the component to display the loading spinner and disabled state before the browser navigates away.
