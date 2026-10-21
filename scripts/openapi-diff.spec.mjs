import { describe, it, expect } from 'vitest';

import { compareSpecs, diffSpecs } from './openapi-diff.mjs';

const createSpec = () => ({
  openapi: '3.1.1',
  info: { title: 'UseGrant SDK', version: '1.0.0' },
  paths: {
    '/v1/providers': {
      get: { operationId: 'providers.list', responses: { 200: { description: 'OK' } } },
      post: { operationId: 'providers.create', responses: { 201: { description: 'OK' } } },
    },
    '/v1/providers/{id}': {
      get: { operationId: 'providers.get', responses: { 200: { description: 'OK' } } },
    },
  },
});

describe('diffSpecs', () => {
  it('should return an empty string when the specs are the same', () => {
    expect(diffSpecs(createSpec(), createSpec())).toBe('');
  });

  it('should ignore key order', () => {
    const upstream = createSpec();
    upstream.paths['/v1/providers'] = {
      post: { responses: { 201: { description: 'OK' } }, operationId: 'providers.create' },
      get: { responses: { 200: { description: 'OK' } }, operationId: 'providers.list' },
    };

    expect(diffSpecs(createSpec(), upstream)).toBe('');
  });

  it('should report added operations', () => {
    const upstream = createSpec();
    upstream.paths['/v1/providers/{id}'].delete = { operationId: 'providers.delete', responses: {} };

    const summary = diffSpecs(createSpec(), upstream);
    expect(summary).toContain('### Added operations');
    expect(summary).toContain('- `DELETE /v1/providers/{id}` (`providers.delete`)');
    expect(summary).not.toContain('### Removed operations');
    expect(summary).not.toContain('### Changed operations');
    expect(summary).not.toContain('### Other changes');
  });

  it('should report operations added under a new path', () => {
    const upstream = createSpec();
    upstream.paths['/v1/tenants'] = { get: { operationId: 'tenants.list', responses: {} } };

    expect(diffSpecs(createSpec(), upstream)).toContain('- `GET /v1/tenants` (`tenants.list`)');
  });

  it('should report removed operations', () => {
    const upstream = createSpec();
    delete upstream.paths['/v1/providers'].post;

    const summary = diffSpecs(createSpec(), upstream);
    expect(summary).toContain('### Removed operations');
    expect(summary).toContain('needs a `major` changeset');
    expect(summary).toContain('- `POST /v1/providers` (`providers.create`)');
    expect(summary).not.toContain('### Added operations');
  });

  it('should report changed operations', () => {
    const upstream = createSpec();
    upstream.paths['/v1/providers/{id}'].get.responses[404] = { description: 'Not found' };

    const summary = diffSpecs(createSpec(), upstream);
    expect(summary).toContain('### Changed operations');
    expect(summary).toContain('- `GET /v1/providers/{id}` (`providers.get`)');
    expect(summary).not.toContain('`GET /v1/providers` ');
  });

  it('should report changes outside of paths', () => {
    const upstream = createSpec();
    upstream.info.version = '1.1.0';

    const summary = diffSpecs(createSpec(), upstream);
    expect(summary).toContain('### Other changes');
    expect(summary).not.toContain('### Changed operations');
  });

  it('should not treat path level fields as operations', () => {
    const committed = createSpec();
    const upstream = createSpec();
    upstream.paths['/v1/providers/{id}'].parameters = [{ name: 'id', in: 'path', required: true }];

    const summary = diffSpecs(committed, upstream);
    expect(summary).not.toContain('### Added operations');
    expect(summary).toContain('### Changed operations');
  });

  it('should list operations without an operationId', () => {
    const upstream = createSpec();
    upstream.paths['/v1/health'] = { get: { responses: {} } };

    expect(diffSpecs(createSpec(), upstream)).toContain('- `GET /v1/health`\n');
  });

  it('should handle specs without paths', () => {
    const { paths: _paths, ...committed } = createSpec();

    const summary = diffSpecs(committed, createSpec());
    expect(summary).toContain('- `GET /v1/providers` (`providers.list`)');
    expect(summary).toContain('- `POST /v1/providers` (`providers.create`)');
    expect(summary).toContain('- `GET /v1/providers/{id}` (`providers.get`)');
  });

  it('should end with the next steps', () => {
    const upstream = createSpec();
    upstream.info.version = '1.1.0';

    expect(diffSpecs(createSpec(), upstream)).toMatch(
      /### Next steps\n\n1\. Run `npm run generate`[\s\S]*3\. Add a changeset$/,
    );
  });
});

describe('compareSpecs', () => {
  it('should return the added, removed and changed operations', () => {
    const upstream = createSpec();
    upstream.paths['/v1/tenants'] = { get: { operationId: 'tenants.list', responses: {} } };
    delete upstream.paths['/v1/providers'].post;
    upstream.paths['/v1/providers/{id}'].get.responses[404] = { description: 'Not found' };

    const { added, removed, changed, otherChanged, hasChanges } = compareSpecs(createSpec(), upstream);
    expect(added.map(([key]) => key)).toEqual(['GET /v1/tenants']);
    expect(removed.map(([key]) => key)).toEqual(['POST /v1/providers']);
    expect(changed.map(([key]) => key)).toEqual(['GET /v1/providers/{id}']);
    expect(otherChanged).toBe(false);
    expect(hasChanges).toBe(true);
  });

  it('should report no changes for the same spec', () => {
    expect(compareSpecs(createSpec(), createSpec()).hasChanges).toBe(false);
  });
});
