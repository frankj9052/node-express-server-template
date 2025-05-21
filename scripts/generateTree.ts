import { writeFileSync, readdirSync, statSync } from 'fs';
import { resolve, relative } from 'path';
import { getCurrentDirname } from '../src/modules/common/utils/path';

// 当前脚本所在目录
const __dirname = getCurrentDirname(import.meta.url);

// 扫描的根目录（上一级）
const targetDir = resolve(__dirname, '..');

// 输出文件路径
const outputPath = resolve(__dirname, '../structure.md');

// ✅ 配置：自定义排除规则
const exclude = {
  // 顶层排除目录
  topLevelDirs: ['dist', 'node_modules', '.git', '.cache', '.next', 'logs'],
  // 精细排除的路径（相对于targetDir）
  exactPaths: ['.husky/_'], // 完整排除.husky/_下的所有文件
};

function shouldExclude(fullPath: string): boolean {
  const relativePath = relative(targetDir, fullPath).replace(/\\/g, '/'); // 统一用 /
  const parts = relativePath.split('/');

  // 1. 顶层目录排除，比如 dist/、node_modules/
  if (parts.length > 0 && exclude.topLevelDirs.includes(parts[0])) {
    return true;
  }

  // 2. 精确路径排除，比如 .husky/_ 目录
  for (const pathToExclude of exclude.exactPaths) {
    if (relativePath.startsWith(pathToExclude)) {
      return true;
    }
  }

  return false;
}

function generateTree(dir: string, prefix = ''): string {
  let tree = '';

  const items = readdirSync(dir).filter(item => {
    const fullPath = resolve(dir, item);
    return !shouldExclude(fullPath);
  });

  const lastIndex = items.length - 1;

  items.forEach((item, index) => {
    const fullPath = resolve(dir, item);
    const stats = statSync(fullPath);
    const isLast = index === lastIndex;
    const pointer = isLast ? '└── ' : '├── ';

    tree += `${prefix}${pointer}${item}\n`;

    if (stats.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      tree += generateTree(fullPath, newPrefix);
    }
  });

  return tree;
}

const treeContent = generateTree(targetDir);

const finalContent = '```plaintext\n' + treeContent + '\n```';

writeFileSync(outputPath, finalContent);

console.log(`✅ Directory structure saved to ${outputPath}`);
