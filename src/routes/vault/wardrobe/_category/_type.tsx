import { Fragment } from "react";
import { useParams } from "react-router-dom";

import { AccordionControl } from "../../../../components/Accordion/Control";
import accordionClasses from "../../../../components/Accordion/index.module.css";
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
      <h3 className={classNames(elementsClasses["no-margin"])}>{type}</h3>
      <section
        className={classNames(materialsClasses["materials__inline-wrapper"])}
      >
        <div className={classNames(accordionClasses["tab"])}>
          <h4
            className={classNames(
              accordionClasses["tab__heading"],
              elementsClasses["no-margin"]
            )}
          >
            {type}
          </h4>
          <AccordionControl onChange={() => {}} open />
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
                {/* <span className={classNames(materialClasses["material__count"])}>
              {""}
            </span> */}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Fragment>
  );
}
