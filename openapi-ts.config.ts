export default {
  input: 'https://sdk.usegrant.dev/open-api.json',
  output: {
    path: 'src/generated',
    postProcess: ['oxfmt'],
    source: true,
  },
  plugins: [
    {
      name: '@hey-api/client-ky',
      throwOnError: true,
      runtimeConfigPath: './src/client-config',
    },
    '@hey-api/typescript',
    {
      name: 'zod',
      metadata: true,
    },
    {
      name: '@hey-api/sdk',
      validator: true,
      paramsStructure: 'flat',
      operations: {
        strategy: 'single',
        containerName: 'UseGrant',
      },
    },
  ],
};
