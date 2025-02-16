# UseGrant SDK

TypeSafe TypeScript SDK for accessing the UseGrant REST API.

[![Tests](https://github.com/usegranthq/sdk/actions/workflows/tests.yml/badge.svg)](https://github.com/usegranthq/sdk/actions/workflows/tests.yml)

## Installation

SDK can be installed using [npm], [bun] or [pnpm] package managers:

```bash
npm install @usegranthq/sdk
# or
bun install @usegranthq/sdk
# or
pnpm install @usegranthq/sdk
```

## Authentication

To use the SDK, you need to have an API key. You can create one in the [UseGrant Settings Page](https://usegrant.dev/u/settings/token) page. If you face any 401 or 403 errors when you are sending a token, it can be one of the following reasons:

- The token is invalid, check if you have copied the token correctly. Also make sure the token is in format `usegrant_api_<token>`.
- The token has expired, you can create a new token and replace the existing token.

## Runtime

The SDK uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) under the hood, which is supported widely in all modern browsers and Node.js(18+).

## Usage

The following example shows how to create a provider using the SDK.

```ts
import UseGrant from '@usegrant/sdk';

const usegrant = new UseGrant('YOUR_API_KEY');

const provider = await usegrant.createProvider({
  name: 'My Provider',
  description: 'My Provider Description',
});
```

Available methods:

- `createProvider`
- `getProvider`
- `deleteProvider`
- `createClient`
- `getClient`
- `deleteClient`
- `createToken`
- `createTenant`
- `getTenant`
- `deleteTenant`
- `createTenantProvider`
- `getTenantProvider`
- `deleteTenantProvider`
- `validateToken`

Refer to the [API Reference](https://usegrant.dev/docs) for more information about the available methods and their parameters.

### Retry Options

The SDK uses the [ky](https://github.com/sindresorhus/ky) library under the hood, which supports retry options. You can pass a `retry` option to the constructor to customize the retry behavior.

```ts
const usegrant = new UseGrant('YOUR_API_KEY', {
  retry: {
    limit: 3,
    backoffLimit: 1000,
  },
});
```

Refer to the [ky retry options](https://github.com/sindresorhus/ky?tab=readme-ov-file#retry) for more information about the available options.

### Error Handling

The SDK throws a custom error `UseGrantError` when you face any errors from the API. You can catch the error and handle it accordingly.

```ts
import { UseGrantError } from '@usegrant/sdk';

try {
  const provider = await usegrant.createProvider({
    name: 'My Provider',
    description: 'My Provider Description',
  });
} catch (error) {
  if (error instanceof UseGrantError) {
    // handle the api error
  }
}
```

[npm]: https://www.npmjs.com
[bun]: https://bun.sh/
[pnpm]: https://pnpm.io
