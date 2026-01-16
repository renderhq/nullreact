import { effect, Signal } from './signals.js';

export type AttributeValue = string | number | boolean | null | undefined;

const createElement = (tag: string): HTMLElement => document.createElement(tag);
const createTextNode = (content: string): Text => document.createTextNode(content);

export { createElement, createTextNode };

export function setAttribute(
    el: HTMLElement,
    key: string,
    value: AttributeValue | Signal<AttributeValue>
): void {
    if (typeof value === 'object' && value !== null && 'get' in value) {
        effect(() => setAttr(el, key, value.get()));
    } else {
        setAttr(el, key, value);
    }
}

function setAttr(el: HTMLElement, key: string, value: AttributeValue): void {
    if (value === false || value == null) {
        el.removeAttribute(key);
    } else if (value === true) {
        el.setAttribute(key, '');
    } else {
        el.setAttribute(key, String(value));
    }
}

export function setProperty(
    el: HTMLElement,
    key: string,
    value: any
): void {
    if (typeof value === 'object' && value !== null && 'get' in value && typeof value.get === 'function') {
        effect(() => { (el as any)[key] = value.get(); });
    } else {
        (el as any)[key] = value;
    }
}

export const insert = (parent: Node, child: Node, anchor: Node | null = null): void => {
    parent.insertBefore(child, anchor);
};

export const remove = (node: Node): void => {
    node.parentNode?.removeChild(node);
};

export function setText(
    node: Text,
    content: string | Signal<string | number>
): void {
    if (typeof content === 'object' && 'get' in content) {
        effect(() => {
            const val = String(content.get());
            if (node.textContent !== val) node.textContent = val;
        });
    } else {
        node.textContent = content;
    }
}

export function on<K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    event: K,
    handler: (event: HTMLElementEventMap[K]) => void
): () => void {
    el.addEventListener(event, handler as EventListener);
    return () => el.removeEventListener(event, handler as EventListener);
}

export function setStyle(
    el: HTMLElement,
    styles: Partial<CSSStyleDeclaration> | Signal<Partial<CSSStyleDeclaration>>
): void {
    if (typeof styles === 'object' && 'get' in styles) {
        effect(() => applyStyles(el, styles.get()));
    } else {
        applyStyles(el, styles);
    }
}

function applyStyles(el: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    for (const key in styles) {
        const value = styles[key];
        if (value != null) (el.style as any)[key] = value;
    }
}

export function toggleClass(
    el: HTMLElement,
    className: string,
    condition: boolean | Signal<boolean>
): void {
    if (typeof condition === 'object' && 'get' in condition) {
        effect(() => el.classList.toggle(className, condition.get()));
    } else {
        el.classList.toggle(className, condition);
    }
}

export const mount = (child: Node, container: Element): void => {
    container.appendChild(child);
};

export const clear = (container: Element): void => {
    container.textContent = '';
};
