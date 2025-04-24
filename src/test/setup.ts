// setup.ts - Jest global setup file

// 可用于初始化测试环境，比如 mock 全局变量、扩展 expect、设置日志行为等

// 示例：关闭测试中的 console.warn 和 console.error 输出
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// 示例：测试结束后恢复原始 console 方法
afterAll(() => {
  (console.warn as jest.Mock).mockRestore();
  (console.error as jest.Mock).mockRestore();
});

// 你也可以引入 jest-extended 或 jest-dom 之类的插件
// import 'jest-extended';
// import '@testing-library/jest-dom';
