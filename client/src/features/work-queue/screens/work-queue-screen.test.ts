/// <reference types="node" />

import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./work-queue-screen.tsx', import.meta.url), 'utf8');

describe('WorkQueueScreen source structure', () => {
  it('uses the page ScrollView as the only vertical queue scroller', () => {
    expect(source).toContain('<ScrollView contentContainerStyle={styles.scrollContent}');
    expect(source).not.toContain('FlatList');
    expect(source).not.toContain('scrollEnabled={false}');
    expect(source).toContain('visibleCases.map((item)');
  });
});
