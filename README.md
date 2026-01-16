# NullReact

A minimalist reactive UI foundation.

## Architecture
- **Fine-grained Reactivity**: Dependency tracking using `signal` and `effect`.
- **Direct DOM**: Updates are applied directly to DOM nodes. No Virtual DOM diffing.
- **Batching**: State updates are batched via `queueMicrotask`.
- **Size**: Core runtime is <1KB gzipped.

## Setup
Clone and build the repository.

```bash
git clone https://github.com/renderhq/nullreact.git
pnpm install
pnpm build
```

## Usage
Link the packages locally in your development environment.

```tsx
import { signal, h, mount } from '@nullreact/runtime';

const count = signal(0);

const View = () => (
  <div>
    <h1>{count}</h1>
    <button onClick={() => count.update(n => n + 1)}>+</button>
  </div>
);

mount(<View />, document.getElementById('root')!);
```

## Development
- `pnpm example:counter`
- `pnpm example:todomvc`

---
Built by Render
[github.com/renderhq/nullreact](https://github.com/renderhq/nullreact)
