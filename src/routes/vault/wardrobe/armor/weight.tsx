import { Fragment } from "react";
import { useParams } from "react-router-dom";

import elementsClasses from "../../../../components/Elements/index.module.css";
import materialClasses from "../../../../components/material.module.css";
import materialsClasses from "../../../../components/materials.module.css";
import { classNames } from "../../../../features/css/classnames";
import { demo, skinAdapter } from "../../../../features/store/api/read-skins";
import { readArmorSlots } from "../../../../features/store/api/read-armor-slots";

const initialState = skinAdapter.getInitialState();

function Zoot(props: { weight: string; type: string }) {
  const { currentData = initialState } = demo.useQuery({
    type: `${props.weight}_${props.type}`,
  });
  return (
    <Fragment>
      <h4>{props.type}</h4>
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

export function VaultWardrobeArmorWeight() {
  const { weight } = useParams();
  const { data: armorSlots = [] } = readArmorSlots.useQuery({});
  return (
    <Fragment>
      <h3>{weight}</h3>
      <ul>
        {armorSlots.map((armorSlot) => (
          <Zoot key={armorSlot} type={armorSlot} weight={weight ?? ""} />
        ))}
      </ul>
    </Fragment>
  );
}
