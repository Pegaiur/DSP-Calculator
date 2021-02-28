import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '戴森球计划量化计算器',
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  mock: false,
});
