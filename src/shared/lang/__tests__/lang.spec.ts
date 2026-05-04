import { describe, expectTypeOf, it } from 'vitest';
import * as enBundle from '../en';
import * as uaBundle from '../ua';

// Type-level parity test: any drift between EN and UA shapes (a missing
// key, a renamed function, an added namespace) breaks the build via
// vue-tsc and trips this test too. Catches it earlier and louder.
describe('lang bundle parity', () => {
  it('UA has the exact shape of EN', () => {
    expectTypeOf<typeof enBundle>().toEqualTypeOf<typeof uaBundle>();
  });
});
