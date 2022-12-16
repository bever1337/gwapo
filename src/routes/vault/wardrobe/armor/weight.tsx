import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import { AccordionControl } from "../../../../components/Accordion/Control";
import accordionClasses from "../../../../components/Accordion/index.module.css";
import elementsClasses from "../../../../components/Elements/index.module.css";
import hideClasses from "../../../../components/HideA11y/index.module.css";
import materialClasses from "../../../../components/material.module.css";
import materialsClasses from "../../../../components/materials.module.css";
import { classNames } from "../../../../features/css/classnames";
import { demo, skinAdapter } from "../../../../features/store/api/read-skins";
import { readArmorSlots } from "../../../../features/store/api/read-armor-slots";

export function VaultWardrobeArmorWeight() {
  const { weight } = useParams();
  const { data: armorSlots = [] } = readArmorSlots.useQuery({});
  return (
    <Fragment>
      <h3 className={classNames(elementsClasses["no-margin"])}>{weight}</h3>
      <ul
        className={classNames(
          elementsClasses["no-margin"],
          elementsClasses["no-padding"]
        )}
      >
        {armorSlots.map((armorSlot) => (
          <VaultWardrobeArmorWeightSlot
            key={armorSlot}
            type={armorSlot}
            weight={weight ?? ""}
          />
        ))}
      </ul>
    </Fragment>
  );
}

const initialState = skinAdapter.getInitialState();

function VaultWardrobeArmorWeightSlot(props: { weight: string; type: string }) {
  const [open, setOpen] = useState(true);
  const { currentData = initialState } = demo.useQuery({
    type: `${props.weight}_${props.type}`,
  });
  return (
    <Fragment>
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
            {props.type}
          </h4>
          <AccordionControl onChange={setOpen} open={open} />
        </div>
        <div
          className={classNames(
            accordionClasses["folder"],
            !open && hideClasses["hide"]
          )}
        >
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
