import { Fragment } from "react";
import { useParams } from "react-router-dom";

import { ArmorClassSlot } from "../../../components/WardrobeTab/ArmorClassSlot";
import { readArmorSlots } from "../../../features/store/api/read-armor-slots";

export function ArmorWeightClass() {
  const { weightClass } = useParams();
  const { data: armorSlots = [] } = readArmorSlots.useQuery({});
  return (
    <Fragment>
      {armorSlots.map((armorSlot) => (
        <ArmorClassSlot
          key={armorSlot}
          slot={armorSlot}
          weight_class={weightClass ?? ""}
        />
      ))}
    </Fragment>
  );
}
