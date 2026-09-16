# ShopWise Learning Guide

## Architecture: where does logic live?

`App.jsx` only wires routes and layout. This deliberately prevents a “god component.”

- **Pages** compose one screen and own page-only UI state.
- **Reusable components** own their UI behavior (`Modal` owns Escape/backdrop closing).
- **Redux slices** own shared business data and changes: products, cart, auth, orders.
- **Custom/context hooks** own reusable stateful behavior (`ThemeProvider`).
- **mockApi.js** owns API behavior; swap it for `fetch()` later without rewriting components.

## React Hooks in this project

### `useState` — local state Hook

Used for search filters, auth form fields, modal draft product, and messages. It is ideal when one component owns the value.

- Why: setting it triggers a re-render with the new UI.
- Without: changing a normal JavaScript variable will not update the screen.
- Alternative: `useReducer` for complex related transitions; Redux for shared application state.

### `useEffect` — synchronization Hook

Used to fetch initial data, apply theme to `document.body`, and manage Escape-key listeners.

- Why: rendering should be pure; browser APIs and async requests happen after rendering.
- Without cleanup: listeners can remain after unmounting.
- Alternative: event-specific handling or a library. Do not use an effect for a value that can be calculated in render.

### `useRef` — persistent mutable reference Hook

Used to focus the catalogue search input.

- Why: it stores a DOM node without triggering a re-render.
- Alternative: `autoFocus` only handles initial focus; direct `document.querySelector` is less React-friendly.

### `useMemo` — performance Hook

Used for filtered and paginated product arrays.

- Why: caches a calculation until `items`, `category`, `searchTerm`, or `page` changes.
- Without: filtering runs on every render; that is still correct and usually fine for small arrays.
- Alternative: calculate directly, paginate/filter in an API, or virtualize massive lists.

### `useCallback` — function-reference Hook

Used for the search handler.

- Why: keeps the same handler reference between renders.
- Without: a new function is created each render, which is normally fine.
- Alternative: regular inline handlers. Use `useCallback` only when referential equality matters (for example, `React.memo`).

### `useReducer` — state-transition Hook

Used for the checkout form.

- Why: a reducer groups field update and reset transitions in one predictable function.
- Alternative: one `useState` object for small forms; a form library for complex validation.

## Other concepts

### React Router

`BrowserRouter` controls routes. `useParams` reads `:productId`; `Navigate` redirects; `Outlet` renders nested protected routes.

### Redux Toolkit

`configureStore` creates the store. `createSlice` defines reducer logic and actions together. `createAsyncThunk` models API pending/success/failure flow. Immer lets reducers write mutation-style code safely.

### Props, lifted state, and events

Data flows down through props; events flow upward through callbacks/Redux actions. Product list receives products and passes one product into `ProductCard`; button click dispatches `addToCart`.

### Controlled forms

Input `value` comes from React state and `onChange` updates that state. This makes validation/reset predictable. Alternative: uncontrolled inputs using `FormData` or React Hook Form.

### Local storage

The Redux store subscription saves cart/user. `loadState` restores them at startup. It is browser-only and good for demos; real auth must be verified by a server.

### Accessibility

The app uses semantic routes, labels, `aria-label` for icon buttons, `role="dialog"` for modal, and a native form submit flow. Native HTML behavior is usually more accessible than reimplementing it.

# Interview Questions

1. **What belongs in Redux vs component state?** Shared data used by distant/multiple screens belongs in Redux; temporary UI/form state usually stays local.
2. **What does `createAsyncThunk` provide?** A standard async action lifecycle: pending, fulfilled, and rejected.
3. **Why do lists need keys?** Keys give React stable item identity during reconciliation. Use a stable id, not an array index for changing lists.
4. **Why not use `useMemo` everywhere?** Memoization adds complexity and overhead; use it only for measurable expensive work or identity requirements.
5. **What is the difference between Context and Redux?** Context distributes values; Redux provides structured global updates, middleware, DevTools, selectors, and async conventions.
6. **Why is state immutable?** New references make changes predictable; Redux Toolkit uses Immer to support safe mutation-like reducer syntax.
7. **What is a controlled component?** A form element whose value is driven by React state.
8. **How does a protected route work?** It checks auth state and returns either an `Outlet` or a redirect.
9. **Why must effects clean up?** To remove event listeners/timers/subscriptions and prevent updates after unmount.
10. **Why does localStorage not replace a backend?** Users can alter it and it is browser-specific; secure sessions and permissions must be validated server-side.
11. **thunk** vs **saga**?** Both handle async flows; thunks are simpler and more explicit, while sagas use generator functions for complex flows and side effects.
12. **What is the difference between `useEffect` and `useLayoutEffect`?** `useEffect` runs after paint, while `useLayoutEffect` runs synchronously before paint, blocking visual updates.
13. **What is the difference between `useMemo` and `useCallback`?** `useMemo` memoizes a value, while `useCallback` memoizes a function reference.
14. **What is the difference between `useReducer` and `useState`?** `useState` is for simple state management, while `useReducer` is better for complex state transitions and logic.
15. **What is the difference between controlled and uncontrolled components?** Controlled components have their state managed by React, while uncontrolled components manage their own state internally.
16. **What is the difference between Redux and Context API?** Redux is a state management library that provides a centralized store, while Context API is a built-in React feature for passing data through the component tree without prop drilling.
17. **Functional component vs class component?** Functional components are simpler and use hooks for state and lifecycle methods, while class components have more boilerplate and use `this` for state and lifecycle methods.