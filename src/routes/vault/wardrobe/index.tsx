import { Fragment } from "react";
import { Form, useSearchParams } from "react-router-dom";

import wardrobeClasses from "./index.module.css";
import { Armor } from "./form/Armor";
import { WardrobeBack } from "./form/Back";
import { Gathering } from "./form/Gathering";
import { Weapon } from "./form/Weapon";

import hideClasses from "../../../components/HideA11y/index.module.css";
import {
  readSkinTypes,
  skinTypesAdapter,
} from "../../../features/store/api/read-skin-types";
import { classNames } from "../../../features/css/classnames";

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
        <fieldset>
          <legend>Wardrobe</legend>
          {skinTypes.ids.map((skinType) => (
            <Fragment key={skinType}>
              <input
                checked={skinType === activeSkinType}
                className={classNames(
                  wardrobeClasses["input"],
                  hideClasses["hide"]
                )}
                id={`routes/vault/wardrobe/Wardrobe/Component/${skinType}`}
                name="Component"
                onChange={() => {}}
                type="radio"
                value={skinType}
              />
              <label
                className={classNames(
                  wardrobeClasses["label"],
                  skinType === activeSkinType &&
                    wardrobeClasses["label--active"]
                )}
                htmlFor={`routes/vault/wardrobe/Wardrobe/Component/${skinType}`}
              >
                {skinType}
              </label>
            </Fragment>
          ))}
        </fieldset>
        {skinTypes.entities[activeSkinType]?.ids.map((subType, index) => (
          <Fragment key={subType}>
            <fieldset>
              <legend>{subType}</legend>
              {skinTypes.entities[activeSkinType]?.[subType].map(
                (choice, index) => (
                  <Fragment key={choice}>
                    <input
                      checked={
                        (searchParams.get(subType) === null && index === 0) ||
                        searchParams.get(subType) === choice
                      }
                      className={classNames(
                        wardrobeClasses["input"],
                        hideClasses["hide"]
                      )}
                      id={`routes/vault/wardrobe/Wardrobe/Component/${subType}/${choice}`}
                      name={subType}
                      onChange={() => {}}
                      type="radio"
                      value={choice}
                    />
                    <label
                      className={classNames(
                        wardrobeClasses["label"],
                        ((searchParams.get(subType) === null && index === 0) ||
                          searchParams.get(subType) === choice) &&
                          wardrobeClasses["label--active"]
                      )}
                      htmlFor={`routes/vault/wardrobe/Wardrobe/Component/${subType}/${choice}`}
                    >
                      {choice}
                    </label>
                  </Fragment>
                )
              )}
            </fieldset>
          </Fragment>
        ))}
      </Form>
      <ActiveComponent />
    </Fragment>
  );
}
