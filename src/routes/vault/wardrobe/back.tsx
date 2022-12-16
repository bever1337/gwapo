import { Fragment } from "react";
import { FormattedMessage } from "react-intl";

import elementsClasses from "../../../components/Elements/index.module.css";
import materialClasses from "../../../components/material.module.css";
import materialsClasses from "../../../components/materials.module.css";
import { classNames } from "../../../features/css/classnames";
import { demo, skinAdapter } from "../../../features/store/api/read-skins";

const initialState = skinAdapter.getInitialState();

export function WardrobeBack() {
  const { data = initialState } = demo.useQuery({ type: "Back" });
  return (
    <Fragment>
      <h3>
        <FormattedMessage defaultMessage="Back" />
      </h3>
      <ul
        className={classNames(
          materialsClasses["materials__list"],
          elementsClasses["no-margin"]
        )}
      >
        {data.ids.map((skinId) => (
          <li
            className={classNames(materialClasses["material__item"])}
            key={skinId}
          >
            <img
              className={classNames(materialClasses["material__img"])}
              alt={data.entities[skinId]?.name ?? ""}
              src={data.entities[skinId]?.icon ?? ""}
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
