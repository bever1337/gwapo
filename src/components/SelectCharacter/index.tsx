// import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Option } from "./option";

import {
  readCharacters,
  selectReadCharactersInScope,
} from "../../features/store/api/read-characters";

export function SelectCharacter() {
  const selectElement = useRef<HTMLSelectElement>(null);
  const { data: characters = [] } = readCharacters.useQuery(
    {},
    { skip: !useSelector(selectReadCharactersInScope) }
  );
  useEffect(
    function bubbleCharactersChangeEvent() {
      if (characters.length) {
        selectElement.current?.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }
    },
    [characters]
  );
  return (
    <select name="SelectCharacter" ref={selectElement}>
      {characters.map((characterName) => (
        <Option key={characterName} characterName={characterName} />
      ))}
    </select>
  );
}
