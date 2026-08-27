/// <reference types="node" />

import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./case-card.tsx', import.meta.url), 'utf8');
const caseCardBody = source.slice(
  source.indexOf('export function CaseCard'),
  source.indexOf('type FactProps'),
);

describe('CaseCard source structure', () => {
  it('keeps the card root non-interactive and exposes a dedicated detail button', () => {
    expect(caseCardBody).toContain('<View style={styles.card}>');
    expect(caseCardBody).not.toContain('<Pressable');
    expect(caseCardBody).not.toContain('accessibilityRole="button"');
    expect(caseCardBody).toContain('label="View details"');
    expect(caseCardBody).toContain('accessibilityLabel={`View details for ${item.clientAlias}.`}');
  });
});
