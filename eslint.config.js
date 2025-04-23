import js from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';
import parser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,

  // ⬇️ 使用 TypeScript 推荐规则（注意是 "flat" 配置）
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
      globals: {
        // 添加 Node.js 的全局变量
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        Buffer: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: pluginPrettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules, // ✅ 使用 TypeScript 推荐规则
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },

  {
    ignores: ['dist/', 'build/', 'node_modules/', '.cache/', '*.config.js'],
  },

  prettier,
];
