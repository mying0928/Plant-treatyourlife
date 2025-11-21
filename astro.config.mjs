import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: 'https://mying0928.github.io/Plant-treatyourlife',
  base: '/Plant-treatyourlife',
  integrations: [tailwind()]
});
