import { signal, effect, batch, h, mount } from '@nullreact/runtime';
import './style.css';

interface Todo { id: number; text: string; completed: boolean; }
type Filter = 'all' | 'active' | 'completed';

const KEY = 'null-todos';
const todos = signal<Todo[]>(JSON.parse(localStorage.getItem(KEY) || '[]'));
const filter = signal<Filter>('all');
const input = signal('');
const editId = signal<number | null>(null);
const editText = signal('');

effect(() => localStorage.setItem(KEY, JSON.stringify(todos.get())));

const visible = () => {
    const all = todos.get(), f = filter.get();
    return f === 'all' ? all : all.filter((t: Todo) => f === 'active' ? !t.completed : t.completed);
};

const counts = () => {
    const all = todos.get();
    const active = all.reduce((n: number, t: Todo) => n + (t.completed ? 0 : 1), 0);
    return { active, completed: all.length - active };
};

const add = () => {
    const val = input.get().trim();
    if (val) {
        batch(() => {
            todos.update((l: Todo[]) => [...l, { id: Date.now(), text: val, completed: false }]);
            input.set('');
        });
    }
};

const toggle = (id: number) => todos.update((l: Todo[]) => l.map((t: Todo) => t.id === id ? { ...t, completed: !t.completed } : t));
const del = (id: number) => todos.update((l: Todo[]) => l.filter((t: Todo) => t.id !== id));
const clear = () => todos.update((l: Todo[]) => l.filter((t: Todo) => !t.completed));

const Item = (todo: Todo) => {
    const editing = () => editId.get() === todo.id;
    return h('li', { class: () => `${todo.completed ? 'completed' : ''} ${editing() ? 'editing' : ''}` },
        h('div', { class: 'view' },
            h('input', { class: 'toggle', type: 'checkbox', checked: todo.completed, onChange: () => toggle(todo.id) }),
            h('label', { onDblClick: () => batch(() => { editId.set(todo.id); editText.set(todo.text); }) }, todo.text),
            h('button', { class: 'destroy', onClick: () => del(todo.id) })
        ),
        editing() && h('input', {
            class: 'edit',
            value: editText.peek(),
            onInput: (e: any) => editText.set(e.target.value),
            onBlur: () => {
                const txt = editText.get().trim();
                if (txt) todos.update((l: Todo[]) => l.map((t: Todo) => t.id === todo.id ? { ...t, text: txt } : t));
                else del(todo.id);
                editId.set(null);
            },
            onKeyDown: (e: any) => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') editId.set(null); },
            ref: (el: any) => el?.focus()
        })
    );
};

const App = () => {
    const c = counts();
    return h('div', { class: 'todoapp' },
        h('header', { class: 'header' },
            h('h1', null, 'todos'),
            h('input', { class: 'new-todo', placeholder: '?', value: input.get(), onInput: (e: any) => input.set(e.target.value), onKeyDown: (e: any) => e.key === 'Enter' && add() })
        ),
        () => todos.get().length > 0 ? h('section', { class: 'main' },
            h('ul', { class: 'todo-list' }, ...visible().map((t: Todo) => Item(t)))
        ) : null,
        () => todos.get().length > 0 ? h('footer', { class: 'footer' },
            h('span', { class: 'todo-count' }, () => `${c.active} item${c.active === 1 ? '' : 's'} left`),
            h('ul', { class: 'filters' }, ['all', 'active', 'completed'].map((f: string) => h('li', null, h('a', { class: () => filter.get() === f ? 'selected' : '', href: `#/${f}`, onClick: () => filter.set(f as any) }, f)))),
            () => counts().completed > 0 ? h('button', { class: 'clear-completed', onClick: clear }, 'Clear') : null
        ) : null
    );
};

mount(App(), document.getElementById('app')!);
