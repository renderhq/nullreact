
# NullReact

NullReact is an experimental reactive UI runtime focused on minimizing abstraction and runtime overhead. It avoids the Virtual DOM entirely and performs direct, fine-grained DOM updates using signals and precise node operations.

This project is a work in progress and primarily serves as a foundation for exploring zero-overhead UI patterns. Some internals are intentionally minimal and not production-hardened.

## Features

* Fine-grained reactivity via signals
* No Virtual DOM
* Microtask-based batching
* Sub-1KB core runtime
* Strict TypeScript

## Usage

NullReact is not published to npm. It is intended to be used locally by linking or copying the runtime.

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Build the core**

   ```bash
   pnpm build
   ```

3. **Link the runtime**

   ```bash
   cd packages/runtime
   pnpm link --global
   ```

4. **Use it in another project**

   ```bash
   pnpm link --global @nullreact/runtime
   ```

## API

### `signal`

Provides fine-grained reactive state with dependency tracking.

```ts
const count = signal(0);

count.get();              // read
count.set(1);             // write
count.update(n => n + 1); // update
```

### `h`

JSX factory function. Reactive expressions are tracked and updated by directly mutating DOM nodes rather than diffing trees.

```tsx
const View = () => (
  <div>
    <h1>{count}</h1>
    <button onClick={() => count.update(n => n + 1)}>+</button>
  </div>
);
```

### `mount`

Mounts a reactive tree into a DOM container.

```ts
mount(<View />, document.getElementById('root')!);
```

## Examples

Geist-styled examples are available in the `examples` directory:

* **Counter**

  ```bash
  pnpm example:counter
  ```

* **TodoMVC**

  ```bash
  pnpm example:todomvc
  ```

## Status

This project is experimental and subject to significant change. APIs and internal behavior are not stable.

---

Built by [Render](https://x.com/infinterenders)

