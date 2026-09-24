import { execFileSync } from 'node:child_process';
import fixtures from './tag-taxonomy-fixtures.json' with { type: 'json' };

let failures = 0;

for (const fixture of fixtures.fixtures) {
  try {
    const output = execFileSync(
      process.execPath,
      ['scripts/tag-post-with-jev.js', fixture.path, '--json'],
      { encoding: 'utf8' }
    );
    const result = JSON.parse(output).result;
    const selected = result.automatic.some(({ tag }) => tag === fixtures.tag);
    const passed = selected === fixture.expected;
    console.log(`${passed ? 'PASS' : 'FAIL'} ${fixture.path} — expected ${fixture.expected}, received ${selected}`);
    if (!passed) failures += 1;
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${fixture.path} — ${error.message}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} fixture(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll taxonomy fixtures passed.');
}
