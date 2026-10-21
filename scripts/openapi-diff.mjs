// Compares the OpenAPI spec the SDK was generated from with the upstream spec and prints a markdown summary.
// Prints nothing when both specs are the same.
//
// Usage: node scripts/openapi-diff.mjs <committed-spec.json> <upstream-spec.json>

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const METHODS = ['get', 'put', 'post', 'delete', 'patch', 'head', 'options', 'trace'];

// stable stringify so key order differences are not reported as changes
const canonical = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map(canonical).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
};

const operations = (spec) => {
  const result = new Map();
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    // fields like `parameters` can be declared once for all operations of a path
    const shared = Object.fromEntries(Object.entries(item).filter(([key]) => !METHODS.includes(key)));
    for (const method of METHODS) {
      if (item[method]) {
        result.set(`${method.toUpperCase()} ${path}`, { ...item[method], 'x-path-item': shared });
      }
    }
  }
  return result;
};

const describe = ([key, operation]) => `- \`${key}\`${operation.operationId ? ` (\`${operation.operationId}\`)` : ''}`;

export const compareSpecs = (committed, upstream) => {
  const before = operations(committed);
  const after = operations(upstream);

  const added = [...after].filter(([key]) => !before.has(key));
  const removed = [...before].filter(([key]) => !after.has(key));
  const changed = [...after].filter(([key, op]) => before.has(key) && canonical(before.get(key)) !== canonical(op));

  const { paths: _committedPaths, ...committedRest } = committed;
  const { paths: _upstreamPaths, ...upstreamRest } = upstream;
  const otherChanged = canonical(committedRest) !== canonical(upstreamRest);

  return {
    added,
    removed,
    changed,
    otherChanged,
    hasChanges: added.length > 0 || removed.length > 0 || changed.length > 0 || otherChanged,
  };
};

export const diffSpecs = (committed, upstream) => {
  const { added, removed, changed, otherChanged, hasChanges } = compareSpecs(committed, upstream);

  if (!hasChanges) {
    return '';
  }

  const sections = [
    'The upstream [OpenAPI spec](https://sdk.usegrant.dev/open-api.json) differs from `src/generated/source.json`, the spec the SDK was last generated from.',
  ];

  if (added.length) {
    sections.push(`### Added operations\n\nNew methods to generate and test.\n\n${added.map(describe).join('\n')}`);
  }
  if (removed.length) {
    sections.push(
      `### Removed operations\n\nBreaking, needs a \`major\` changeset.\n\n${removed.map(describe).join('\n')}`,
    );
  }
  if (changed.length) {
    sections.push(
      `### Changed operations\n\nParameters, request bodies or responses changed, check whether the change is breaking.\n\n${changed.map(describe).join('\n')}`,
    );
  }
  if (otherChanged) {
    sections.push(
      '### Other changes\n\nParts of the spec outside `paths` changed, such as `info`, `servers` or `components`.',
    );
  }

  sections.push(
    '### Next steps\n\n1. Run `npm run generate` and review the changes in `src/generated`\n2. Add or update tests for the affected methods\n3. Add a changeset',
  );

  return sections.join('\n\n');
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [committedPath, upstreamPath] = process.argv.slice(2);
  const summary = diffSpecs(
    JSON.parse(readFileSync(committedPath, 'utf8')),
    JSON.parse(readFileSync(upstreamPath, 'utf8')),
  );
  if (summary) {
    console.log(summary);
  }
}
