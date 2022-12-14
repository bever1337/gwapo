import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { Option } from "./option";

import { readCharacters } from "../../features/store/api/read-characters";

function noop() {}

export function SelectCharacter() {
  const selectElement = useRef<HTMLSelectElement>(null);
  const characterName =
    new URLSearchParams(useLocation().search).get("select_character") ?? "";
  const { data: characters } = readCharacters.useQuery({});
  useEffect(
    function bubbleCharactersChangeEvent() {
      if ((characters?.length ?? 0) > 0) {
        selectElement.current?.dispatchEvent(
          new Event("change", { bubbles: true, cancelable: true })
        );
      }
    },
    [characters]
  );
  return (
    <select
      form="routerMonoForm"
      name="select_character"
      onChange={noop}
      ref={selectElement}
      value={characterName}
    >
      {characters?.map((characterName) => (
        <Option key={characterName} characterName={characterName} />
      )) ?? null}
    </select>
  );
}
