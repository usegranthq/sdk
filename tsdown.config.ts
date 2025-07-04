import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/schema.ts'],
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  outDir: 'dist',
  outputOptions: {
    exports: 'named',
  },
});
