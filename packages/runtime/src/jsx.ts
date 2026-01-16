import { createElement, setAttribute, insert, on, createTextNode, setText, remove } from './dom.js';
import { Signal, effect } from './signals.js';

export type JSXChild = Node | string | number | Signal<any> | (() => any) | null | undefined | boolean;
export type JSXChildren = JSXChild | JSXChild[] | any[];

export interface JSXProps {
    [key: string]: any;
    children?: JSXChildren;
}

export function h(
    tag: string | ((props: JSXProps) => Node),
    props: JSXProps | null,
    ...children: any[]
): Node {
    if (typeof tag === 'function') return tag({ ...props, children });

    const el = createElement(tag);

    if (props) {
        for (const key in props) {
            if (key === 'children') continue;
            const value = props[key];

            if (key.startsWith('on') && typeof value === 'function') {
                on(el, key.slice(2).toLowerCase() as any, value);
            } else if (key === 'class' || key === 'className') {
                el.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else if (key === 'ref' && typeof value === 'function') {
                value(el);
            } else {
                setAttribute(el, key, value);
            }
        }
    }

    const flat = children.flat(Infinity);
    for (let i = 0, len = flat.length; i < len; i++) {
        const child = flat[i];
        if (child == null || child === false || child === true) continue;

        if (child instanceof Node) {
            insert(el, child);
        } else if (typeof child === 'function') {
            let current: Node = createTextNode('');
            insert(el, current);
            effect(() => {
                const val = child();
                let next: Node;
                if (val instanceof Node) {
                    next = val;
                } else if (val == null || val === false || val === true) {
                    next = createTextNode('');
                } else {
                    next = createTextNode(String(val));
                }
                if (next !== current) {
                    el.replaceChild(next, current);
                    current = next;
                }
            });
        } else if (typeof child === 'object' && 'get' in child) {
            const textNode = createTextNode('');
            insert(el, textNode);
            setText(textNode, child as Signal<any>);
        } else {
            insert(el, createTextNode(String(child)));
        }
    }

    return el;
}

export function Fragment(props: { children: JSXChildren }): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const children = (Array.isArray(props.children) ? props.children : [props.children]).flat(Infinity);

    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        if (child instanceof Node) {
            fragment.appendChild(child);
        } else if (typeof child === 'function') {
            let current: Node = createTextNode('');
            fragment.appendChild(current);
            // Note: Fragments are tricky after initial mount because they disappear.
            // In a real app, the parent element would be needed. 
            // For NullReact simplicity, we assume functional children in Fragments 
            // are mostly used for static-ish lists or where parent replaces the fragment.
            effect(() => {
                const val = child();
                const next = val instanceof Node ? val : createTextNode(val == null || val === false || val === true ? '' : String(val));
                if (next !== current && current.parentNode) {
                    current.parentNode.replaceChild(next, current);
                    current = next;
                }
            });
        } else if (child != null && child !== false && child !== true) {
            fragment.appendChild(createTextNode(String(child)));
        }
    }

    return fragment;
}

declare global {
    namespace JSX {
        interface IntrinsicElements { [elem: string]: any; }
        interface Element extends Node { }
        interface ElementChildrenAttribute { children: {}; }
    }
}
