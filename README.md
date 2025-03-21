# UseGrant SDK

TypeSafe TypeScript SDK for accessing the UseGrant REST API.

[![Tests](https://github.com/usegranthq/sdk/actions/workflows/tests.yml/badge.svg)](https://github.com/usegranthq/sdk/actions/workflows/tests.yml)

## Installation

SDK can be installed using [npm], [bun] or [pnpm] package managers:

```bash
npm install @usegrant/sdk
# or
bun install @usegrant/sdk
# or
pnpm install @usegrant/sdk
```

## Authentication

To use the SDK, you need to have an API key. You can create one in the [UseGrant Settings Page](https://usegrant.dev/u/settings/token) page. If you face any 401 or 403 errors when you are sending a token, it can be one of the following reasons:

- The token is invalid, check if you have copied the token correctly. Also make sure the token is in format `uga_<token>`.
- The token has expired, you can create a new token and replace the existing token.

## Runtime

The SDK uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) under the hood, which is supported widely in all modern browsers and Node.js(18+).

## Usage

The following example shows how to create a provider using the SDK.

```ts
import UseGrant from '@usegrant/sdk';

// Initialize the SDK
const usegrant = new UseGrant('YOUR_API_KEY');

// Create a provider
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
- `addDomain`
- `getDomain`
- `getDomains`
- `verifyDomain`
- `deleteDomain`
- `createToken`
- `createTenant`
- `getTenant`
- `deleteTenant`
- `createTenantProvider`
- `getTenantProvider`
- `deleteTenantProvider`
- `validateToken`

Refer to the [API Reference](https://usegrant.dev/docs) for more information about the available methods and their parameters.

## TypeScript Support

The SDK is written in TypeScript and provides full type safety out of the box. All methods and their parameters are fully typed:

## Configuration

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

### Abort Signal

The SDK supports abort signal to cancel the request. You can pass a `signal` option to the constructor to customize the abort behavior.

```ts
const usegrant = new UseGrant('YOUR_API_KEY', {
  signal: AbortSignal.timeout(1000),
});
```

Refer to the [ky retry options](https://github.com/sindresorhus/ky?tab=readme-ov-file#retry) for more information about the available options.

### Error Handling

The SDK throws a custom error `UseGrantError` when you face any errors from the API. You can catch the error and handle it accordingly.

```ts
import { UseGrant, UseGrantError } from '@usegrant/sdk';

const usegrant = new UseGrant('YOUR_API_KEY');

try {
  const provider = await usegrant.createProvider({
    name: 'My Provider',
    description: 'My Provider Description',
  });
} catch {
  // handle the error
}
```

### Error Handling

The SDK throws a custom error `UseGrantError` when you face any errors from the API or `ZodError` when you face any errors from the schema validation. You can catch the error and handle it accordingly.

```ts
import { UseGrant, UseGrantError } from '@usegrant/sdk';
import { z } from 'zod';

const usegrant = new UseGrant('YOUR_API_KEY');

try {
  const provider = await usegrant.createProvider({
    name: 'My Provider',
    description: 'My Provider Description',
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    // handle the validation error
  }

  if (error instanceof UseGrantError) {
    // handle the api error
  }

  // handle the unknown error
}
```

### Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run changeset `npx @changeset/cli` to generate the changelog and commit the generated changelog file along with the changes
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please make sure to update tests as appropriate and follow the existing coding style.

For reference to changeset, please refer to the [Changeset Documentation](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md).

[npm]: https://www.npmjs.com
[bun]: https://bun.sh/
[pnpm]: https://pnpm.io
