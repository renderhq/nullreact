type EffectFn = () => void;
type CleanupFn = () => void;

interface Effect {
    (): void;
    deps: Set<Effect>[];
}

let currentEffect: Effect | null = null;
const effectStack: Effect[] = [];
const pendingEffects = new Set<Effect>();
let scheduled = false;

export function effect(fn: EffectFn): CleanupFn {
    const wrapped = (() => {
        cleanup(wrapped);
        currentEffect = wrapped;
        effectStack.push(wrapped);
        fn();
        effectStack.pop();
        currentEffect = effectStack[effectStack.length - 1] || null;
    }) as Effect;

    wrapped.deps = [];
    wrapped();

    return () => cleanup(wrapped);
}

function cleanup(effectFn: Effect): void {
    for (let i = 0, len = effectFn.deps.length; i < len; i++) {
        effectFn.deps[i].delete(effectFn);
    }
    effectFn.deps.length = 0;
}

export function signal<T>(initialValue: T) {
    let value = initialValue;
    const subscribers = new Set<Effect>();

    return {
        get(): T {
            if (currentEffect && !subscribers.has(currentEffect)) {
                subscribers.add(currentEffect);
                currentEffect.deps.push(subscribers);
            }
            return value;
        },

        set(newValue: T): void {
            if (value !== newValue) {
                value = newValue;
                for (const eff of subscribers) scheduleEffect(eff);
            }
        },

        update(fn: (prev: T) => T): void {
            this.set(fn(value));
        },

        peek(): T {
            return value;
        }
    };
}

function scheduleEffect(eff: Effect): void {
    pendingEffects.add(eff);
    if (!scheduled) {
        scheduled = true;
        queueMicrotask(runEffects);
    }
}

function runEffects(): void {
    scheduled = false;
    const effects = Array.from(pendingEffects);
    pendingEffects.clear();
    for (let i = 0, len = effects.length; i < len; i++) {
        effects[i]();
    }
}

export function computed<T>(fn: () => T) {
    const sig = signal<T>(undefined as T);
    effect(() => sig.set(fn()));
    return { get: () => sig.get() };
}

export function batch(fn: () => void): void {
    const wasScheduled = scheduled;
    scheduled = true;
    fn();
    if (!wasScheduled) {
        scheduled = false;
        runEffects();
    }
}

export type Signal<T> = ReturnType<typeof signal<T>>;
export type Computed<T> = ReturnType<typeof computed<T>>;
