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

Set your API key on the client once, then create the SDK and call the API.

```ts
import UseGrant, { client } from '@usegrant/sdk';

// Configure the client with your API key
client.setConfig({ auth: 'YOUR_API_KEY' });

const usegrant = new UseGrant();

// Create a provider
const { data: provider } = await usegrant.providers.create({
  name: 'My Provider',
  description: 'My Provider Description',
});

// Create a client for the provider
const { data: providerClient } = await usegrant.providers.clients.create({
  providerId: provider.id,
  name: 'My Client',
  audience: 'my-audience',
});
```

The SDK is generated from the [OpenAPI spec](https://sdk.usegrant.dev/open-api.json), so every API operation is available as a method grouped by resource, for example `usegrant.providers.list()`, `usegrant.providers.domains.verify()`, `usegrant.tenants.providers.policies.create()` or `usegrant.tenants.tokens.validate()`. Each method takes the path parameters and request body fields of the operation in a single object and resolves with `{ data, request, response }`.

Refer to the [API Reference](https://usegrant.dev/docs) for more information about the available methods and their parameters.

## TypeScript Support

The SDK is written in TypeScript and provides full type safety out of the box. All methods, their parameters and responses are fully typed, and the request and response types of every operation are exported, for example `ProvidersCreateData` and `ProvidersCreateResponse`.

## Configuration

The SDK uses the [ky](https://github.com/sindresorhus/ky) library under the hood. Options are set on the client with `client.setConfig()`.

### Retry Options

```ts
client.setConfig({
  retry: {
    limit: 3,
    backoffLimit: 1000,
  },
});
```

Refer to the [ky retry options](https://github.com/sindresorhus/ky?tab=readme-ov-file#retry) for more information about the available options.

### Abort Signal and Timeout

```ts
client.setConfig({
  signal: AbortSignal.timeout(1000),
  timeout: 5000,
});
```

Avoid overriding `kyOptions.hooks`, the SDK uses it to convert API errors to `UseGrantError`.

### Multiple API Keys

`client` is shared by every `UseGrant` instance. To use a different API key or base URL for an instance, pass it its own client:

```ts
import UseGrant, { client, createClient } from '@usegrant/sdk';

const usegrant = new UseGrant({
  client: createClient({ ...client.getConfig(), auth: 'OTHER_API_KEY' }),
});
```

Spreading `client.getConfig()` keeps the SDK defaults such as the base URL and error handling.

## Error Handling

The SDK throws a `UseGrantError` when the API responds with an error and a `ZodError` when the request or response fails the schema validation. You can catch the error and handle it accordingly.

```ts
import UseGrant, { UseGrantError } from '@usegrant/sdk';
import { z } from 'zod';

const usegrant = new UseGrant();

try {
  const { data: provider } = await usegrant.providers.create({
    name: 'My Provider',
    description: 'My Provider Description',
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    // handle the validation error
  }

  if (error instanceof UseGrantError) {
    // handle the api error
    console.log(error.status, error.code, error.message);
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

The API client in `src/generated` is generated from the [OpenAPI spec](https://sdk.usegrant.dev/open-api.json) with [Hey API](https://heyapi.dev). Run `npm run generate` to regenerate it, do not edit the generated files by hand.

Please make sure to update tests as appropriate and follow the existing coding style.

For reference to changeset, please refer to the [Changeset Documentation](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md).

[npm]: https://www.npmjs.com
[bun]: https://bun.sh/
[pnpm]: https://pnpm.io
