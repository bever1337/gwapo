import { createAction } from '@reduxjs/toolkit';
import type { CombinedState } from '@reduxjs/toolkit/dist/query';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hydrate = createAction<CombinedState<any, any, 'cache'>, 'hydrate'>('hydrate');
