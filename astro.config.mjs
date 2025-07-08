import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
// import path from 'path';

export default defineConfig({
    output: 'server',
    server: {
        host: true, 
    },
    adapter: node({
        mode: 'standalone'
    }),
});
