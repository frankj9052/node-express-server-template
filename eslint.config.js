import js from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';
import parser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

const pluginJest = await import('eslint-plugin-jest');

export default [
  // ✅ 通用 JavaScript 推荐规则
  js.configs.recommended,

  // ✅ TypeScript 支持与规则
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        // project: ['./tsconfig.json'],
        project: file =>
          file.startsWith('scripts/') ? ['./tsconfig.scripts.json'] : ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: pluginPrettier,
      jest: pluginJest,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },

  // ✅ Jest 测试专用规则，仅在测试文件中启用
  {
    files: ['**/*.test.ts', '**/__tests__/**/*.ts', 'src/test/setup.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // ✅ 忽略某些目录
  {
    ignores: ['dist/', 'build/', 'node_modules/', '.cache/', '*.config.js'],
  },

  // ✅ Prettier 规则最后执行（避免冲突）
  prettier,
];
