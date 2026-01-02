## 2024-07-25 - Importance of Immediate Feedback

**Learning:** When a user action triggers a navigation or a process that isn't instantaneous (like an API call or page redirect), the interface must provide immediate feedback. Without it, users may assume the action failed and click again, leading to frustration or unintended consequences.

**Action:** For any action that doesn't produce an immediate result, implement a loading state. This can be a disabled button, a spinner, or a toast message. For the login button, I added a loading state that disables the button and shows a "Redirecting..." message to prevent multiple clicks during the redirect.
