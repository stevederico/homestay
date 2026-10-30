import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isUpgradeRequired } from './upgrade.ts';

describe('isUpgradeRequired', () => {
  it('is true for a 402 from apiRequest', () => {
    assert.equal(isUpgradeRequired(new Error('Request failed: 402 Payment Required')), true);
  });

  it('is false for other HTTP failures', () => {
    assert.equal(isUpgradeRequired(new Error('Request failed: 404 Not Found')), false);
  });

  it('is false for a status that only starts with 402', () => {
    assert.equal(isUpgradeRequired(new Error('Request failed: 4021 Odd')), false);
  });

  it('is false for network errors', () => {
    assert.equal(isUpgradeRequired(new Error('Network error: 402 bytes lost')), false);
  });

  it('is false for non-Error values', () => {
    assert.equal(isUpgradeRequired('Request failed: 402'), false);
  });
});
