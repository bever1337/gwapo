import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";

import accordionClasses from "../../../../components/Accordion/index.module.css";
import elementsClasses from "../../../../components/Elements/index.module.css";
import materialClasses from "../../../../components/material.module.css";
import materialsClasses from "../../../../components/materials.module.css";
import { classNames } from "../../../../features/css/classnames";
import {
  readSkins,
  skinAdapter,
} from "../../../../features/store/api/read-skins";

const initialState = skinAdapter.getInitialState();

export function Gathering() {
  const [urlSearchParams] = useSearchParams();
  const tool = urlSearchParams.get("Tool");
  const { currentData = initialState } = readSkins.useQuery(
    tool ? { type: tool } : skipToken,
    { skip: !tool }
  );
  return (
    <Fragment>
      <section
        className={classNames(materialsClasses["materials__inline-wrapper"])}
      >
        <div className={classNames(accordionClasses["tab"])}>
          <h3
            className={classNames(
              accordionClasses["tab__heading"],
              elementsClasses["no-margin"]
            )}
          >
            {tool}
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
