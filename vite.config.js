import { botExclusionPlugin } from './scripts/bot-exclusion.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const ITCH_MAX_BOARDS = 900;
const BOARD_EXTS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.avif']);

/**
 * Caps bundled board images in itch.io builds so the ZIP stays below itch.io's 1000-file limit.
 */
function itchBoardLimitPlugin() {
    return {
        name: 'itch-board-limit',
        enforce: 'pre',
        transform(code, id) {
            const normalizedId = id.replace(/\\/g, '/');
            if (!normalizedId.endsWith('/src/services/board-backgrounds.js')) {
                return null;
            }
            const boardsDir = path.resolve(path.dirname(id), '../assets/boards');
            const files = fs.readdirSync(boardsDir)
                .filter((name) => BOARD_EXTS.has(path.extname(name).toLowerCase()))
                .sort((a, b) => {
                    if (a.startsWith('alpenpanorama_')) return -1;
                    if (b.startsWith('alpenpanorama_')) return 1;
                    return a.localeCompare(b);
                })
                .slice(0, ITCH_MAX_BOARDS);

            const imports = files.map((file, idx) => `import __board${idx} from '../assets/boards/${file}';`).join('\n');
            const entries = files.map((file, idx) => `    '../assets/boards/${file}': __board${idx},`).join('\n');
            const replacement = `${imports}\nconst discoveredBoardModules = {\n${entries}\n};`;

            return {
                code: code.replace(/const discoveredBoardModules = import\.meta\.glob\([\s\S]*?\);/, replacement),
                map: null,
            };
        },
    };
}

export default defineConfig(({ mode }) => {
    const isItch = mode === 'itch' || process.env.BUILD_TARGET === 'itch';
    return {
        base: isItch ? './' : '/',
        plugins: [botExclusionPlugin(), react(), ...(isItch ? [itchBoardLimitPlugin()] : [])],
        build: {
            outDir: isItch ? 'dist-itch' : 'dist',
            emptyOutDir: true,
            rolldownOptions: {
                output: {
                    codeSplitting: {
                        groups: [
                            { name: 'vendor-react', test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
                            { name: 'vendor-centrifuge', test: /[\\/]node_modules[\\/]centrifuge[\\/]/ },
                            { name: 'board-catalog', test: /board-background-catalog\.json$/ },
                        ],
                    },
                },
            },
        },
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./tests/setup.js'],
            include: ['tests/**/*.test.{js,jsx}'],
            coverage: {
                provider: 'v8',
                include: ['src/**/*.{js,jsx,ts}'],
                reporter: ['text', 'lcov', 'json-summary'],
                reportsDirectory: './coverage',
            },
        },
    };
});
