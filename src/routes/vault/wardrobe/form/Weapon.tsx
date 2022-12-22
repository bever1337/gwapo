import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";

import { AccordionHeading } from "../../../../components/Accordion/Heading";
import accordionClasses from "../../../../components/Accordion/index.module.css";
import containerClasses from "../../../../components/Containers/Common/Container.module.css";
import containerItemClasses from "../../../../components/Containers/Common/ContainerItem.module.css";
import elementsClasses from "../../../../components/Elements/index.module.css";
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

export function Weapon() {
  const { data: skinTypes = initialSkinTypesState } = readSkinTypes.useQuery(
    {}
  );
  const [urlSearchParams] = useSearchParams();
  const weaponType =
    urlSearchParams.get("Type") ??
    skinTypes.entities["Weapon"]?.["Type"]?.[0] ??
    "";
  const { currentData = initialArmorSkinsState } = readSkins.useQuery(
    weaponType ? { type: weaponType } : skipToken,
    { skip: !weaponType }
  );
  return (
    <Fragment>
      <section>
        <div className={classNames(accordionClasses["tab"])}>
          <AccordionHeading>{weaponType}</AccordionHeading>
        </div>
        <div className={classNames(accordionClasses["folder"])}>
          <ul
            className={classNames(
              containerClasses["container"],
              elementsClasses["no-margin"]
            )}
          >
            {currentData.ids.map((skinId) => (
              <li
                className={classNames(containerItemClasses["item"])}
                key={skinId}
              >
                <img
                  className={classNames(containerItemClasses["item__img"])}
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
