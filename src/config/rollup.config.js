import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/server.ts', // 你的主入口
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js', // 输出文件命名
    chunkFileNames: '[name]-[hash].js', // 分片文件命名（如果有）
    assetFileNames: '[name]-[hash][extname]', // 资源文件命名（如果有）
    exports: 'auto', // 自动推断导出类型
    manualChunks: undefined, // 不做手动分包
  },
  external: [
    // 保持这些依赖不被打包进 dist
    'express',
    'typeorm',
    'pg',
    'reflect-metadata',
    'zod',
    'cors',
    'dotenv-flow',
    'swagger-jsdoc',
    'swagger-ui-express',
    'fs', // Node.js 内置模块
    'path', // Node.js 内置模块
    'url', // Node.js 内置模块
  ],
  plugins: [
    resolve({ preferBuiltins: true }), // 优先 Node.js 内置模块
    commonjs(), // 支持 CommonJS 引用（比如 express）
    typescript({ tsconfig: './tsconfig.json' }), // 编译 TS
  ],
  treeshake: true, // 打开 tree-shaking（自动去除无用代码）
  watch: {
    clearScreen: true,
  },
};
