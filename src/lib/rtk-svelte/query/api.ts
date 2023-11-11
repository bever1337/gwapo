import { buildCreateApi, coreModule } from '@reduxjs/toolkit/query';

import { buildSvelteModule } from './build-module';

export const createSvelteApi = buildCreateApi(coreModule(), buildSvelteModule());
