import { readArmorSkins } from "../../../features/store/api/read-armor-skins";

export function ArmorClassSlot(props: { slot: string; weight_class: string }) {
  readArmorSkins.useQuery({
    type: props.slot,
    weight_class: props.weight_class,
  });

  return (
    <p>
      {props.slot}, {props.weight_class}
    </p>
  );
}
