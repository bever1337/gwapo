import { Fragment } from "react";
import { Form, useSearchParams } from "react-router-dom";

import { Armor } from "./form/Armor";
import { WardrobeBack } from "./form/Back";
import { Gathering } from "./form/Gathering";
import { Weapon } from "./form/Weapon";

import {
  readSkinTypes,
  skinTypesAdapter,
} from "../../../features/store/api/read-skin-types";

const initialState = skinTypesAdapter.getInitialState();
const Components = {
  Armor,
  Back: WardrobeBack,
  Gathering,
  Weapon,
} as {
  [key: string]: (props: any) => JSX.Element;
};
const UnknownComponent = (props: any) => {
  return <p>404</p>;
};

export function Wardrobe() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: skinTypes = initialState } = readSkinTypes.useQuery({});
  const activeSkinType =
    searchParams.get("Component") ?? skinTypes?.ids[0] ?? "";
  const ActiveComponent = Components[activeSkinType] ?? UnknownComponent;
  return (
    <Fragment>
      <h2>Wardrobe</h2>
      <Form
        onChange={(event) => {
          const formData = new FormData(event.currentTarget);
          const urlSearchParams = new URLSearchParams(formData as any);
          setSearchParams(urlSearchParams);
        }}
      >
        {skinTypes.ids.map((skinType) => (
          <label key={skinType}>
            {skinType}
            <input
              checked={skinType === activeSkinType}
              name="Component"
              onChange={() => {}}
              type="radio"
              value={skinType}
            />
          </label>
        ))}
        <hr />
        {skinTypes.entities[activeSkinType]?.ids.map((subType, index) => (
          <Fragment key={subType}>
            <h3>{subType}</h3>
            {skinTypes.entities[activeSkinType]?.[subType].map(
              (choice, index) => (
                <label key={choice}>
                  {choice}
                  <input
                    checked={searchParams.get(subType) === choice}
                    name={subType}
                    onChange={() => {}}
                    type="radio"
                    value={choice}
                  />
                </label>
              )
            )}
            <hr />
          </Fragment>
        ))}
      </Form>
      <ActiveComponent />
    </Fragment>
  );
}
