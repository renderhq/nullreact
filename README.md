# NullReact

Zero-overhead reactive foundation. Smallest runtime in existence.

## Build Architecture
- **No Virtual DOM**: Direct DOM manipulation with surgical updates.
- **Fine-grained Reactivity**: Dependency tracking via `signal()` and `effect()`.
- **Microtask Batching**: Multiple state updates result in a single effect run.
- **Minimalist Core**: Core runtime is <1KB gzipped.

## Setup
```bash
git clone https://github.com/renderhq/nullreact.git
pnpm install
pnpm build
```

## Usage
Link `@nullreact/runtime` locally.

```tsx
import { signal, h, mount } from '@nullreact/runtime';

const count = signal(0);
const App = () => (
  <div>
    <h1>{count}</h1>
    <button onClick={() => count.update(n => n + 1)}>+</button>
  </div>
);

mount(App(), document.getElementById('root')!);
```

## Examples
- `pnpm example:counter`
- `pnpm example:todomvc`

---
Developed by **Render**
[github.com/renderhq/nullreact](https://github.com/renderhq/nullreact)
