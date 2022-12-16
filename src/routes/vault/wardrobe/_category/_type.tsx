import { Fragment } from "react";
import { useParams } from "react-router-dom";

import elementsClasses from "../../../../components/Elements/index.module.css";
import materialClasses from "../../../../components/material.module.css";
import materialsClasses from "../../../../components/materials.module.css";
import { classNames } from "../../../../features/css/classnames";
import { demo, skinAdapter } from "../../../../features/store/api/read-skins";

const initialState = skinAdapter.getInitialState();

export function WardrobeCategoryType() {
  const { type } = useParams();
  const { currentData = initialState } = demo.useQuery({ type: type! });
  return (
    <Fragment>
      <h3>{type}</h3>
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
            {/* <span className={classNames(materialClasses["material__count"])}>
              {""}
            </span> */}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
