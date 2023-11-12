import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '明日方舟：终末地量化计算器',
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  mock: false,
  hash: true,
});
