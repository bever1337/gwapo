import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";

import accordionClasses from "../../../../components/Accordion/index.module.css";
import elementsClasses from "../../../../components/Elements/index.module.css";
import materialClasses from "../../../../components/material.module.css";
import materialsClasses from "../../../../components/materials.module.css";
import { classNames } from "../../../../features/css/classnames";
import {
  readSkinTypes,
  skinTypesAdapter,
} from "../../../../features/store/api/read-skin-types";
import {
  readSkins,
  skinAdapter,
} from "../../../../features/store/api/read-skins";

const initialSkinTypesState = skinTypesAdapter.getInitialState();
const initialArmorSkinsState = skinAdapter.getInitialState();

export function Armor() {
  const { data: skinTypes = initialSkinTypesState } = readSkinTypes.useQuery(
    {}
  );
  const [urlSearchParams] = useSearchParams();
  const armorSlot =
    urlSearchParams.get("Slot") ??
    skinTypes.entities["Armor"]?.["Slot"]?.[0] ??
    "";
  const armorWeight =
    urlSearchParams.get("Weight") ??
    skinTypes.entities["Armor"]?.["Weight"]?.[0] ??
    "";
  const { currentData = initialArmorSkinsState } = readSkins.useQuery(
    armorSlot && armorWeight
      ? { type: `${armorWeight}_${armorSlot}` }
      : skipToken,
    { skip: !(armorSlot && armorWeight) }
  );
  return (
    <Fragment>
      <section>
        <div className={classNames(accordionClasses["tab"])}>
          <h3
            className={classNames(
              accordionClasses["tab__heading"],
              elementsClasses["no-margin"]
            )}
          >
            {/** CSS styles applied on empty. Doing extra work to ensure heading is empty and not a single white space */}
            {[armorWeight, armorSlot].filter((v) => !!v).join(" ")}
          </h3>
        </div>
        <div className={classNames(accordionClasses["folder"])}>
          <ul
            className={classNames(
              materialsClasses["materials__list"],
              elementsClasses["no-margin"]
            )}
          >
            {currentData.ids.map((skinId) => (
              <li
                className={classNames(materialClasses["material__item"])}
                key={skinId}
              >
                <img
                  className={classNames(materialClasses["material__img"])}
                  alt={currentData.entities[skinId]?.name ?? ""}
                  src={currentData.entities[skinId]?.icon ?? ""}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Fragment>
  );
}
