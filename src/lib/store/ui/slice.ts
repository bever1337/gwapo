import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../";

import { readCharacters } from "../api/read-characters";

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
  extraReducers(builder) {
    builder.addMatcher(readCharacters.matchFulfilled, (state, action) => {
      const invalidCharacterNameState = !action.payload.includes(state.characterName);
      if (invalidCharacterNameState) {
        state.characterName = action.payload[0] ?? "";
      }
    });
  },
});

export const selectUiSubstate = (state: RootState) =>
  state[uiSlice.name] ?? uiSlice.getInitialState();

export const characterName = uiSlice.actions.characterName;
export const selectCharacterName = (state: RootState) => selectUiSubstate(state).characterName;
