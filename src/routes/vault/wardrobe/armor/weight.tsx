import { Fragment } from "react";
import { useParams } from "react-router-dom";

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
      <ul>
        {currentData.ids.map((skinId) => (
          <li key={skinId}>{currentData.entities[skinId]?.name}</li>
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
