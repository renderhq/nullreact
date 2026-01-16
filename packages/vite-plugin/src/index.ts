import type { Plugin } from 'vite';

export interface NullReactPluginOptions {
    include?: string | RegExp | (string | RegExp)[];
    exclude?: string | RegExp | (string | RegExp)[];
}

export default function nullreact(_options: NullReactPluginOptions = {}): Plugin {
    return {
        name: 'vite-plugin-nullreact',
        config() {
            return {
                esbuild: { jsx: 'preserve' },
                optimizeDeps: { include: ['@nullreact/runtime'] }
            };
        },
        transform(code, id) {
            if (!/\.(jsx|tsx)$/.test(id)) return null;
            return {
                code: code
                    .replace(/import\s+{([^}]+)}\s+from\s+['"]@nullreact\/runtime['"]/g, 'import { $1 } from "@nullreact/runtime"')
                    .replace(/<([A-Z]\w*)/g, 'h($1')
                    .replace(/<(\w+)/g, 'h("$1"'),
                map: null
            };
        }
    };
}
