import { slice } from "./slice";

import type { RootState } from "../reducer";

export const selectClient = (state: RootState | undefined) =>
  state?.[slice.name] ?? slice.getInitialState();

export const selectGw2Url = (state: RootState) => selectClient(state).gw2_url;

export const selectGwapoEdgeUrl = (state: RootState) => selectClient(state).gwapo_edge_url;
