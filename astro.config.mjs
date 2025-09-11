import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: 'https://mying0928.github.io',
  base: '/Plant-Astro', // 我們將部署到新的儲存庫
  integrations: [tailwind()]
});
