// Warns when the upstream OpenAPI spec differs from the one the SDK was generated from.
// Never fails, so it is safe to run from git hooks. Skipped when the spec can't be fetched, e.g. offline.
//
// Usage: node scripts/check-upstream-spec.mjs

import { readFileSync } from 'node:fs';

import { compareSpecs } from './openapi-diff.mjs';

const SPEC_URL = 'https://sdk.usegrant.dev/open-api.json';
const COMMITTED_SPEC = new URL('../src/generated/source.json', import.meta.url);
const TIMEOUT = 3000;

try {
  const response = await fetch(SPEC_URL, { signal: AbortSignal.timeout(TIMEOUT) });
  if (response.ok) {
    const committed = JSON.parse(readFileSync(COMMITTED_SPEC, 'utf8'));
    const { added, removed, changed, otherChanged, hasChanges } = compareSpecs(committed, await response.json());

    if (hasChanges) {
      const details = [
        `${added.length} added, ${removed.length} removed, ${changed.length} changed operations`,
        ...(otherChanged ? ['changes outside of paths'] : []),
      ].join(', ');
      console.warn(`\n⚠ Upstream OpenAPI spec changed (${details}). Run \`npm run generate\` to update the SDK.\n`);
    }
  }
} catch {
  // the check is best effort, ignore network and parse errors
}
