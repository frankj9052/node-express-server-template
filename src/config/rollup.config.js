// src/config/rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import { builtinModules } from 'node:module';

const outputDir = 'dist';

const jsBuild = {
  input: 'src/server.ts',
  output: {
    dir: outputDir,
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
    assetFileNames: '[name]-[hash][extname]',
    exports: 'auto',
  },
  external: [
    'express',
    'typeorm',
    'pg',
    'reflect-metadata',
    'zod',
    'cors',
    'dotenv-flow',
    'swagger-jsdoc',
    'swagger-ui-express',
    ...builtinModules,
  ],
  plugins: [
    del({ targets: `${outputDir}/*` }), // 自动清空 dist/
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
