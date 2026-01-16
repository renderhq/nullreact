import { signal, h, mount } from '@nullreact/runtime';
import './style.css';

const count = signal(0);
const step = signal(1);

const App = () => {
    const isEven = () => (count.get() & 1) === 0;
    return h('div', { class: 'container' },
        h('div', { class: 'card' },
            h('h1', { class: 'title' }, 'NullReact'),
            h('div', { class: 'counter-display' },
                h('div', { class: 'count' }, count),
                h('div', { class: 'badge' }, () => isEven() ? 'Even' : 'Odd')
            ),
            h('div', { class: 'controls' },
                h('button', { class: 'btn btn-primary', onClick: () => count.update((n: number) => n - step.get()) }, '-'),
                h('button', { class: 'btn btn-danger', onClick: () => count.set(0) }, '0'),
                h('button', { class: 'btn btn-primary', onClick: () => count.update((n: number) => n + step.get()) }, '+')
            ),
            h('input', { type: 'range', min: '1', max: '10', value: step.get(), onInput: (e: any) => step.set(+e.target.value) })
        )
    );
};

mount(App(), document.getElementById('app')!);
