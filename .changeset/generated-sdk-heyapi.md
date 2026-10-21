---
'@usegrant/sdk': major
---

Generate the SDK from the OpenAPI spec with Hey API

- Configure the API key and options with `client.setConfig({ auth: 'YOUR_API_KEY' })` and create the SDK with `new UseGrant()`
- Methods are grouped by resource and take a single object, e.g. `getClient(providerId, clientId)` is now `providers.clients.get({ providerId, clientId })`
- Methods resolve with `{ data, request, response }`
- `UseGrantError` no longer extends ky's `HTTPError`, it exposes `status`, `code`, `message`, `data`, `request` and `response`
- Types and `@usegrant/sdk/schema` exports are generated from the spec, e.g. `Provider` is now `ProvidersGetResponse` and `CreateProviderSchema` is now `zProvidersCreateBody`
