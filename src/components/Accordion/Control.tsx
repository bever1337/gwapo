import accordionClasses from "./index.module.css";
import hiddenClasses from "../HideA11y/index.module.css";

import { classNames } from "../../features/css/classnames";

const TRIANGLE_CLOSED = "\u25B6";
const TRIANGLE_OPEN = "\u25BC";

export function AccordionControl({
  onChange,
  open,
}: {
  onChange: (nextOpen: boolean) => void;
  open: boolean;
}) {
  return (
    <label className={classNames(accordionClasses["control"])}>
      <span
        role="img"
        aria-label={`Indicates data is ${open ? "expanded" : "hidden"}`}
      >
        {open ? TRIANGLE_OPEN : TRIANGLE_CLOSED}
      </span>
      <span className={classNames(hiddenClasses["hidden"])}>
        Toggle expanding and hiding data
      </span>
      <input
        checked={open}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        name={`collapse-sharedInventory`}
        type="checkbox"
      />
    </label>
  );
}
