import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../reducer";

export const uiSlice = createSlice({
  initialState: {
    characterName: "",
  },
  name: "ui",
  reducers: {
    characterName(state, action: { payload: string }) {
      state.characterName = action.payload;
    },
  },
  extraReducers() {},
});

export const selectUiSubstate = (state: RootState) =>
  state[uiSlice.name] ?? uiSlice.getInitialState();

export const characterName = uiSlice.actions.characterName;

export const selectCharacterName = (state: RootState) => selectUiSubstate(state).characterName;
