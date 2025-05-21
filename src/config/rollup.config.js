// src/config/rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import { builtinModules } from 'node:module';
import path from 'node:path';
import fg from 'fast-glob';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');
// 新增：打包所有 seeds 文件
const seedEntries = fg.sync('src/modules/**/seeds/*.seed.ts', { dot: false });
const migrationEntries = fg.sync('src/migrations/**/*.ts', { dot: false });

/* ────────── 通用配置 ────────── */
const externalDeps = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...builtinModules,
];

const outputDir = 'dist';
const routeEntries = fg.sync('src/modules/**/routes.ts', { dot: false });

const tsAliasEntries = [
  { find: /^@modules\/(.*)/, replacement: path.resolve('src/modules/$1') },
  { find: /^@common\/(.*)/, replacement: path.resolve('src/modules/common/$1') },
  { find: /^@\/(.*)/, replacement: path.resolve('src/$1') },
];

/** 基础插件集合（供三个 build 共用） */
const basePlugins = [
  alias({ entries: tsAliasEntries }),
  resolve({ preferBuiltins: true }),
  commonjs({ extensions: ['.js', '.ts'] }),
  json(),
  typescript({
    tsconfig: './tsconfig.json',
    // ⚠️ 覆写 outDir：让插件不再与 Rollup output.dir 冲突
    compilerOptions: { outDir: undefined },
  }),
];

const entryFiles = [
  'src/server.ts',
  ...routeEntries,
  ...seedEntries, // 新增seed文件入口
  ...migrationEntries,
];

/* ────────── 1. 应用主包（CommonJS） ────────── */
const jsBuild = {
  input: entryFiles,
  output: {
    dir: outputDir,
    format: 'esm',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
    assetFileNames: '[name]-[hash][extname]',
    exports: 'auto',
  },
  external: externalDeps,
  plugins: [del({ targets: `${outputDir}/*` }), ...basePlugins],
  treeshake: { moduleSideEffects: 'no-external' },
};

const dtsBuild = {
  input: 'src/server.ts',
  output: { dir: outputDir, exports: 'named', format: 'esm', entryFileNames: '[name].d.ts' },
  plugins: [dts()],
};

export default [jsBuild, dtsBuild];
