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

// 直接从package.json中拿取dependencies添加到排除
const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

const externalDeps = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...builtinModules,
];

const outputDir = 'dist';

/** 用 fast-glob 找到所有 routes.ts 作为额外入口  */
const routeEntries = fg.sync('src/modules/**/routes.ts', { dot: false });

/** 复用 tsconfig 路径别名（@modules/*、@common/*） */
const tsAliasEntries = [
  { find: /^@modules\/(.*)/, replacement: path.resolve('src/modules/$1') },
  { find: /^@common\/(.*)/, replacement: path.resolve('src/modules/common/$1') },
];

const jsBuild = {
  /** 多入口：主入口 + 路由文件 */
  input: ['src/server.ts', ...routeEntries],
  output: {
    dir: outputDir,
    format: 'esm',
    sourcemap: true,
    /** 保留模块层级，编译后仍在 dist/modules/... */
    preserveModules: true,
    preserveModulesRoot: 'src',
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
    assetFileNames: '[name]-[hash][extname]',
    exports: 'auto',
  },
  external: externalDeps,
  plugins: [
    del({ targets: `${outputDir}/*` }), // 自动清空 dist/
    alias({ entries: tsAliasEntries }), // 让 Rollup 识别 @modules/*
    resolve({
      preferBuiltins: true,
    }),
    commonjs({
      extensions: ['.js', '.ts'],
    }),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      outputToFilesystem: true,
    }),
  ],
  treeshake: {
    moduleSideEffects: 'no-external',
  },
  watch: {
    clearScreen: true,
  },
};

const dtsBuild = {
  input: 'src/server.ts',
  output: {
    dir: outputDir,
    format: 'esm',
    entryFileNames: '[name].d.ts',
  },
  plugins: [dts()],
};

// 导出两个配置
export default [jsBuild, dtsBuild];
