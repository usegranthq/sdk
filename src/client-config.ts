import { isHTTPError } from 'ky';

import type { CreateClientConfig } from './generated/client.gen';
import { UseGrantError } from './error';

// runtime config for the generated client, see `runtimeConfigPath` in openapi-ts.config.ts
export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  kyOptions: {
    ...config?.kyOptions,
    hooks: {
      // ky v2 consumes the body of HTTPError responses, which the generated client then fails to read.
      // converting it here makes the generated client rethrow the error as is
      beforeError: [({ error }) => (isHTTPError(error) ? new UseGrantError(error) : error)],
    },
  },
});
